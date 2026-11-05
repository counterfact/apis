import assert from "node:assert/strict";
import test from "node:test";
import * as scenarios from "../api/scenarios/index.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import type { DictionaryRule } from "../api/routes/pronunciation-dictionaries/_.context.js";

test("adding dictionary rules replaces matching strings and preserves version snapshots", async () => {
  const runner = await createScenarioRunner();
  await runner.run(scenarios.startup);
  const context = runner.loadContext("/pronunciation-dictionaries");
  const baseline = context.getDictionary("sim-dictionary")!;
  const archived = context.getDictionary("sim-dictionary-archived");
  const rules: DictionaryRule[] = [
    { type: "phoneme", string_to_replace: "API", phoneme: "eɪpiːaɪ", alphabet: "ipa" },
    { type: "alias", string_to_replace: "SDK", alias: "first" },
    { type: "alias", string_to_replace: "SDK", alias: "S D K" },
  ];
  const result = context.addRules("sim-dictionary", rules);
  assert.deepEqual(result.value, { id: "sim-dictionary", version_id: "sim-dictionary-v2", version_rules_num: 3 });
  rules[0].string_to_replace = "external mutation";
  result.value!.version_id = "external mutation";
  const updated = context.getDictionary("sim-dictionary")!;
  assert.equal(updated.latest_version_id, "sim-dictionary-v2");
  assert.equal(updated.latest_version_rules_num, 3);
  assert.equal(updated.rules.find((rule) => rule.string_to_replace === "API")!.type, "phoneme");
  assert.deepEqual(updated.rules.find((rule) => rule.string_to_replace === "SDK"), { type: "alias", string_to_replace: "SDK", alias: "S D K" });
  assert.deepEqual(context.dictionaries.get("sim-dictionary")!.versions.get(baseline.latest_version_id), baseline.rules);
  assert.deepEqual(context.getDictionary("sim-dictionary-archived"), archived);
  assert.equal(context.addRules("missing", []).missing, true);
  const before = structuredClone(context.dictionaries);
  assert.match(context.addRules("sim-dictionary", [{ type: "alias", string_to_replace: "", alias: "invalid" }]).error!, /non-empty/);
  assert.deepEqual(context.dictionaries, before);
  assert.equal(context.addRules("sim-dictionary", []).value!.version_id, "sim-dictionary-v3");
  assert.equal(context.getDictionary("sim-dictionary")!.rules.length, 3);
  await runner.run(scenarios.reset);
  assert.deepEqual(context.getDictionary("sim-dictionary"), baseline);
});

test("add-rules dispatches persisted versions, rejects errors atomically, and resets", async () => {
  const app = await createDispatcherHarness();
  const other = await createDispatcherHarness();
  const endpoint = "/v1/pronunciation-dictionaries/sim-dictionary/add-rules";
  const post = (path: string, body: unknown) => app.request(path, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  const detail = async () => (await app.request("/v1/pronunciation-dictionaries/sim-dictionary")).json();
  const baseline = await detail();
  const response = await post(endpoint, { rules: [
    { type: "alias", string_to_replace: "API", alias: "application interface" },
    { type: "phoneme", string_to_replace: "New", phoneme: "njuː", alphabet: "ipa" },
  ] });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type")!, /application\/json/);
  assert.deepEqual(await response.json(), { id: "sim-dictionary", version_id: "sim-dictionary-v2", version_rules_num: 3 });
  const updated = await detail();
  assert.equal(updated.latest_version_rules_num, 3);
  assert.equal(updated.rules.find((rule: DictionaryRule) => rule.string_to_replace === "API").alias, "application interface");
  const listing = await (await app.request("/v1/pronunciation-dictionaries")).json();
  assert.equal(listing.pronunciation_dictionaries.find((item: { id: string }) => item.id === "sim-dictionary").latest_version_id, updated.latest_version_id);
  for (const body of [{}, { rules: [{ type: "alias", string_to_replace: "broken" }] }, { rules: [{ type: "alias", string_to_replace: "", alias: "broken" }] }]) {
    assert.equal((await post(endpoint, body)).status, 400);
    assert.deepEqual(await detail(), updated);
  }
  const missing = await post("/v1/pronunciation-dictionaries/missing/add-rules", { rules: [] });
  assert.equal(missing.status, 404);
  assert.equal((await missing.json()).detail.status, "pronunciation_dictionary_not_found");
  assert.equal((await (await other.request("/v1/pronunciation-dictionaries/sim-dictionary")).json()).latest_version_id, baseline.latest_version_id);
  await app.scenario("reset", "api");
  assert.deepEqual(await detail(), baseline);
});

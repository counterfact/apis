import assert from "node:assert/strict";
import test from "node:test";
import * as scenarios from "../api/scenarios/index.js";
import type { DictionaryRule } from "../api/routes/pronunciation-dictionaries/_.context.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";

test("setting dictionary rules replaces all rules and retains immutable versions", async () => {
  const runner = await createScenarioRunner();
  await runner.run(scenarios.startup);
  const context = runner.loadContext("/pronunciation-dictionaries");
  const baseline = context.getDictionary("sim-dictionary")!;
  const other = context.getDictionary("sim-dictionary-archived");
  const rules: DictionaryRule[] = [
    { type: "alias", string_to_replace: "SDK", alias: "S D K" },
    { type: "phoneme", string_to_replace: "New", phoneme: "njuː", alphabet: "ipa" },
    { type: "alias", string_to_replace: "SDK", alias: "software development kit" },
  ];
  const expected = structuredClone(rules);
  const result = context.setRules("sim-dictionary", rules);
  assert.deepEqual(result.value, { id: "sim-dictionary", version_id: "sim-dictionary-v2", version_rules_num: 3 });
  rules[0].string_to_replace = "external mutation";
  result.value!.version_id = "external mutation";
  assert.deepEqual(context.getDictionary("sim-dictionary")!.rules, expected);
  assert.deepEqual(context.dictionaries.get("sim-dictionary")!.versions.get(baseline.latest_version_id), baseline.rules);
  assert.deepEqual(context.getDictionary("sim-dictionary-archived"), other);
  const beforeInvalid = structuredClone(context.dictionaries);
  assert.equal(context.setRules("missing", []).missing, true);
  assert.match(context.setRules("sim-dictionary", [{ type: "alias", string_to_replace: "", alias: "invalid" }]).error!, /non-empty/);
  assert.deepEqual(context.dictionaries, beforeInvalid);
  assert.equal(context.setRules("sim-dictionary", []).value!.version_id, "sim-dictionary-v3");
  assert.deepEqual(context.getDictionary("sim-dictionary")!.rules, []);
  assert.deepEqual(context.dictionaries.get("sim-dictionary")!.versions.get("sim-dictionary-v2"), expected);
  assert.equal(context.setRules("sim-dictionary", []).value!.version_id, "sim-dictionary-v4");
  await runner.run(scenarios.reset);
  assert.deepEqual(context.getDictionary("sim-dictionary"), baseline);
});

test("set-rules replaces list/detail state, validates atomically, isolates instances, and resets", async () => {
  const app = await createDispatcherHarness();
  const other = await createDispatcherHarness();
  const endpoint = "/v1/pronunciation-dictionaries/sim-dictionary/set-rules";
  const post = (path: string, body: unknown) => app.request(path, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  const detail = async () => (await app.request("/v1/pronunciation-dictionaries/sim-dictionary")).json();
  const baseline = await detail();
  const rules = [
    { type: "alias", string_to_replace: "SDK", alias: "S D K" },
    { type: "phoneme", string_to_replace: "New", phoneme: "njuː", alphabet: "ipa" },
  ];
  const response = await post(endpoint, { rules });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type")!, /application\/json/);
  assert.deepEqual(await response.json(), { id: "sim-dictionary", version_id: "sim-dictionary-v2", version_rules_num: 2 });
  const updated = await detail();
  assert.deepEqual(updated.rules, rules);
  assert.equal(updated.latest_version_id, "sim-dictionary-v2");
  const listing = await (await app.request("/v1/pronunciation-dictionaries")).json();
  const metadata = listing.pronunciation_dictionaries.find((item: { id: string }) => item.id === "sim-dictionary");
  assert.equal(metadata.latest_version_id, updated.latest_version_id);
  assert.equal(metadata.latest_version_rules_num, 2);
  for (const body of [{}, { rules: "invalid" }, { rules: [{ type: "alias", string_to_replace: "X" }] }, { rules: [{ type: "alias", string_to_replace: "", alias: "invalid" }] }]) {
    assert.equal((await post(endpoint, body)).status, 400);
    assert.deepEqual(await detail(), updated);
  }
  const missing = await post("/v1/pronunciation-dictionaries/missing/set-rules", { rules: [] });
  assert.equal(missing.status, 404);
  assert.equal((await missing.json()).detail.status, "pronunciation_dictionary_not_found");
  assert.deepEqual(await detail(), updated);
  assert.deepEqual(await (await other.request("/v1/pronunciation-dictionaries/sim-dictionary")).json(), baseline);
  const cleared = await post(endpoint, { rules: [] });
  assert.equal(cleared.status, 200);
  assert.deepEqual(await cleared.json(), { id: "sim-dictionary", version_id: "sim-dictionary-v3", version_rules_num: 0 });
  assert.deepEqual((await detail()).rules, []);
  await app.scenario("reset", "api");
  assert.deepEqual(await detail(), baseline);
});

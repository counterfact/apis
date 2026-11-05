import assert from "node:assert/strict";
import test from "node:test";
import * as scenarios from "../api/scenarios/index.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";

test("removing dictionary rules matches exact strings and preserves earlier versions", async () => {
  const runner = await createScenarioRunner();
  await runner.run(scenarios.startup);
  const context = runner.loadContext("/pronunciation-dictionaries");
  const baseline = context.getDictionary("sim-dictionary")!;
  const archived = context.getDictionary("sim-dictionary-archived");
  const result = context.removeRules("sim-dictionary", ["API", "API", "absent", "counterfact"]);
  assert.deepEqual(result.value, { id: "sim-dictionary", version_id: "sim-dictionary-v2", version_rules_num: 1 });
  const updated = context.getDictionary("sim-dictionary")!;
  assert.deepEqual(updated.rules.map((rule) => rule.string_to_replace), ["Counterfact"]);
  assert.equal(updated.latest_version_id, "sim-dictionary-v2");
  assert.equal(updated.latest_version_rules_num, 1);
  assert.deepEqual(context.dictionaries.get("sim-dictionary")!.versions.get(baseline.latest_version_id), baseline.rules);
  result.value!.version_id = "external mutation";
  assert.equal(context.getDictionary("sim-dictionary")!.latest_version_id, "sim-dictionary-v2");
  assert.deepEqual(context.getDictionary("sim-dictionary-archived"), archived);
  const beforeMissing = structuredClone(context.dictionaries);
  assert.equal(context.removeRules("missing", []).missing, true);
  assert.deepEqual(context.dictionaries, beforeMissing);
  assert.equal(context.removeRules("sim-dictionary", []).value!.version_id, "sim-dictionary-v3");
  assert.deepEqual(context.getDictionary("sim-dictionary")!.rules, updated.rules);
  assert.equal(context.removeRules("sim-dictionary", ["Counterfact"]).value!.version_rules_num, 0);
  assert.deepEqual(context.getDictionary("sim-dictionary")!.rules, []);
  await runner.run(scenarios.reset);
  assert.deepEqual(context.getDictionary("sim-dictionary"), baseline);
});

test("remove-rules updates list and detail, validates requests atomically, and resets", async () => {
  const app = await createDispatcherHarness();
  const other = await createDispatcherHarness();
  const endpoint = "/v1/pronunciation-dictionaries/sim-dictionary/remove-rules";
  const post = (path: string, body: unknown) => app.request(path, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  const detail = async () => (await app.request("/v1/pronunciation-dictionaries/sim-dictionary")).json();
  const baseline = await detail();
  const response = await post(endpoint, { rule_strings: ["API", "API", "absent"] });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type")!, /application\/json/);
  assert.deepEqual(await response.json(), { id: "sim-dictionary", version_id: "sim-dictionary-v2", version_rules_num: 1 });
  const updated = await detail();
  assert.equal(updated.latest_version_rules_num, 1);
  assert.deepEqual(updated.rules.map((rule: { string_to_replace: string }) => rule.string_to_replace), ["Counterfact"]);
  const listing = await (await app.request("/v1/pronunciation-dictionaries")).json();
  const metadata = listing.pronunciation_dictionaries.find((item: { id: string }) => item.id === "sim-dictionary");
  assert.equal(metadata.latest_version_id, updated.latest_version_id);
  assert.equal(metadata.latest_version_rules_num, 1);
  for (const body of [{}, { rule_strings: "API" }, { rule_strings: [7] }]) {
    assert.equal((await post(endpoint, body)).status, 400);
    assert.deepEqual(await detail(), updated);
  }
  const missing = await post("/v1/pronunciation-dictionaries/missing/remove-rules", { rule_strings: [] });
  assert.equal(missing.status, 404);
  assert.equal((await missing.json()).detail.status, "pronunciation_dictionary_not_found");
  assert.deepEqual(await detail(), updated);
  assert.equal((await (await other.request("/v1/pronunciation-dictionaries/sim-dictionary")).json()).latest_version_id, baseline.latest_version_id);
  const empty = await post(endpoint, { rule_strings: [] });
  assert.equal(empty.status, 200);
  assert.equal((await empty.json()).version_id, "sim-dictionary-v3");
  const removedAll = await post(endpoint, { rule_strings: ["Counterfact"] });
  assert.equal(removedAll.status, 200);
  assert.equal((await removedAll.json()).version_rules_num, 0);
  assert.deepEqual((await detail()).rules, []);
  await app.scenario("reset", "api");
  assert.deepEqual(await detail(), baseline);
});

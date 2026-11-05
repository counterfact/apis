import assert from "node:assert/strict";
import test from "node:test";
import * as scenarios from "../api/scenarios/index.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";

test("dictionary metadata updates preserve versions and isolate returned metadata", async () => {
  const runner = await createScenarioRunner();
  await runner.run(scenarios.startup);
  const context = runner.loadContext("/pronunciation-dictionaries");
  const baseline = context.getDictionary("sim-dictionary")!;
  const other = context.getDictionary("sim-dictionary-archived");
  const versions = structuredClone(context.dictionaries.get("sim-dictionary")!.versions);
  const updated = context.updateDictionary("sim-dictionary", { name: "Renamed", archived: true })!;
  assert.equal(updated.name, "Renamed");
  assert.equal(updated.archived_time_unix, 1735689900);
  assert.equal(updated.latest_version_id, baseline.latest_version_id);
  assert.equal(updated.latest_version_rules_num, baseline.latest_version_rules_num);
  assert.equal("rules" in updated, false);
  updated.name = "Changed externally";
  assert.equal(context.getDictionary("sim-dictionary")!.name, "Renamed");
  assert.equal(context.listDictionaries({ include_archived: false }).page!.pronunciation_dictionaries.length, 0);
  assert.equal(context.updateDictionary("sim-dictionary", {})!.archived_time_unix, 1735689900);
  assert.equal(context.updateDictionary("sim-dictionary", { archived: true })!.archived_time_unix, 1735689900);
  assert.equal(context.updateDictionary("sim-dictionary", { archived: false })!.archived_time_unix, null);
  assert.equal(context.getDictionary("sim-dictionary")!.name, "Renamed");
  assert.equal(context.updateDictionary("missing", {}), undefined);
  assert.deepEqual(context.dictionaries.get("sim-dictionary")!.versions, versions);
  assert.deepEqual(context.getDictionary("sim-dictionary")!.rules, baseline.rules);
  assert.deepEqual(context.getDictionary("sim-dictionary-archived"), other);
  await runner.run(scenarios.reset);
  assert.deepEqual(context.getDictionary("sim-dictionary"), baseline);
});

test("dictionary PATCH updates browsing, validates atomically, isolates instances, and resets", async () => {
  const app = await createDispatcherHarness();
  const other = await createDispatcherHarness();
  const path = "/v1/pronunciation-dictionaries/sim-dictionary";
  const patch = (target: string, body: unknown) => app.request(target, {
    method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  const detail = async () => (await app.request(path)).json();
  const baseline = await detail();
  const response = await patch(path, { name: "A Renamed Dictionary", archived: true });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type")!, /application\/json/);
  const metadata = await response.json();
  assert.equal(metadata.id, "sim-dictionary");
  assert.equal(metadata.name, "A Renamed Dictionary");
  assert.equal(metadata.archived_time_unix, 1735689900);
  assert.equal("rules" in metadata, false);
  const archived = await detail();
  assert.deepEqual(archived.rules, baseline.rules);
  assert.equal(archived.latest_version_id, baseline.latest_version_id);
  assert.equal(archived.latest_version_rules_num, baseline.latest_version_rules_num);
  const active = await (await app.request("/v1/pronunciation-dictionaries?include_archived=false")).json();
  assert.deepEqual(active.pronunciation_dictionaries, []);
  const sorted = await (await app.request("/v1/pronunciation-dictionaries?sort=name&sort_direction=ascending")).json();
  assert.equal(sorted.pronunciation_dictionaries[0].name, metadata.name);
  assert.equal((await patch(path, {})).status, 200);
  assert.deepEqual(await detail(), archived);
  for (const body of [{ name: null }, { archived: "true" }, { name: "Invalid", archived: null }]) {
    assert.equal((await patch(path, body)).status, 400);
    assert.deepEqual(await detail(), archived);
  }
  const missing = await patch("/v1/pronunciation-dictionaries/missing", { name: "Missing" });
  assert.equal(missing.status, 404);
  assert.equal((await missing.json()).detail.status, "pronunciation_dictionary_not_found");
  const restored = await patch(path, { archived: false });
  assert.equal(restored.status, 200);
  assert.equal((await restored.json()).archived_time_unix, null);
  assert.equal((await detail()).name, metadata.name);
  const activeAgain = await (await app.request("/v1/pronunciation-dictionaries?include_archived=false")).json();
  assert.equal(activeAgain.pronunciation_dictionaries.length, 1);
  assert.deepEqual(await (await other.request(path)).json(), baseline);
  await app.scenario("reset", "api");
  assert.deepEqual(await detail(), baseline);
});

import assert from "node:assert/strict";
import test from "node:test";
import * as scenarios from "../api/scenarios/index.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import type { DictionaryRule } from "../api/routes/pronunciation-dictionaries/_.context.js";

const rules = (): DictionaryRule[] => [
  { type: "alias", string_to_replace: "SDK", alias: "S D K", case_sensitive: false },
  { type: "phoneme", string_to_replace: "API", phoneme: "eɪ piː aɪ", alphabet: "ipa", word_boundaries: true },
];

test("dictionary creation persists isolated version snapshots and resets identifiers", async () => {
  const runner = await createScenarioRunner();
  await runner.run(scenarios.startup);
  const context = runner.loadContext("/pronunciation-dictionaries");
  const input = { name: "Client Terms", description: "Synthetic terms", rules: rules(), workspace_access: "viewer" as const };
  const created = context.createDictionary(input).value!;
  assert.equal(created.id, "sim-dictionary-created-1");
  assert.equal(created.version_id, `${created.id}-v1`);
  assert.equal(created.version_rules_num, 2);
  assert.equal(created.created_by, "sim-user");
  assert.equal(created.permission_on_resource, "admin");
  input.rules[0].string_to_replace = "External input mutation";
  created.name = "External output mutation";
  const detail = context.getDictionary(created.id)!;
  assert.equal(detail.name, "Client Terms");
  assert.equal(detail.rules[0].string_to_replace, "SDK");
  detail.rules[0].string_to_replace = "External detail mutation";
  assert.equal(context.dictionaries.get(created.id)!.versions.get(created.version_id)![0].string_to_replace, "SDK");
  const second = context.createDictionary({ name: "Empty Terms", rules: [] }).value!;
  assert.equal(second.id, "sim-dictionary-created-2");
  assert.equal(second.version_rules_num, 0);
  assert.equal(second.creation_time_unix, created.creation_time_unix + 1);
  const before = context.listDictionaries({}).page;
  assert.equal(typeof context.createDictionary({ name: "Invalid", rules: [{ type: "alias", string_to_replace: "", alias: "empty" }] }).error, "string");
  assert.deepEqual(context.listDictionaries({}).page, before);
  await runner.run(scenarios.reset);
  assert.equal(context.getDictionary(created.id), undefined);
  assert.equal(context.createDictionary({ name: "Reset Terms", rules: [] }).value!.id, "sim-dictionary-created-1");
});

test("dictionary creation dispatches JSON validation and shared read state without affecting other domains", async () => {
  const app = await createDispatcherHarness();
  const other = await createDispatcherHarness();
  const read = async (path: string) => {
    const response = await app.request(path);
    assert.equal(response.status, 200);
    return response.json();
  };
  const paths = ["/v1/voices", "/v1/models", "/v1/history", "/v1/user"];
  const baseline = await Promise.all(paths.map(read));
  const create = (body: unknown) => app.request("/v1/pronunciation-dictionaries/add-from-rules", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  const body = { name: "Client Terms", description: "Synthetic terms", rules: rules(), workspace_access: "viewer" };
  const response = await create(body);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type")!, /application\/json/);
  const created = await response.json();
  assert.equal(created.id, "sim-dictionary-created-1");
  assert.equal(created.version_rules_num, 2);
  const detail = await read(`/v1/pronunciation-dictionaries/${created.id}`);
  assert.equal(detail.latest_version_id, created.version_id);
  assert.equal(detail.description, body.description);
  assert.equal(detail.permission_on_resource, "admin");
  assert.deepEqual(detail.rules, body.rules);
  assert.equal((await read("/v1/pronunciation-dictionaries")).pronunciation_dictionaries.length, 3);
  assert.equal((await (await other.request("/v1/pronunciation-dictionaries")).json()).pronunciation_dictionaries.length, 2);
  for (const invalid of [{ name: "Missing rules" }, { name: "Malformed rule", rules: [{ type: "alias", string_to_replace: "API" }] }, { name: "Empty source", rules: [{ type: "alias", string_to_replace: "", alias: "empty" }] }]) {
    assert.equal((await create(invalid)).status, 400);
  }
  assert.equal((await read("/v1/pronunciation-dictionaries")).pronunciation_dictionaries.length, 3);
  const empty = await create({ name: "Empty", rules: [] });
  assert.equal(empty.status, 200);
  const emptyCreated = await empty.json();
  assert.equal(emptyCreated.id, "sim-dictionary-created-2");
  assert.deepEqual((await read(`/v1/pronunciation-dictionaries/${emptyCreated.id}`)).rules, []);
  assert.deepEqual(await Promise.all(paths.map(read)), baseline);
  await app.scenario("reset", "api");
  assert.equal((await app.request(`/v1/pronunciation-dictionaries/${created.id}`)).status, 404);
  assert.equal((await (await create({ name: "Reset", rules: [] })).json()).id, "sim-dictionary-created-1");
});

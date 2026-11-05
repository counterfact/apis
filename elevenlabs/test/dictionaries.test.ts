import assert from "node:assert/strict";
import test from "node:test";
import * as scenarios from "../api/scenarios/index.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";

test("dictionary context isolates sorted metadata pages and scenario state", async () => {
  const runner = await createScenarioRunner();
  const context = runner.loadContext("/pronunciation-dictionaries");
  assert.deepEqual(context.listDictionaries({}).page!.pronunciation_dictionaries, []);
  await runner.run(scenarios.startup);
  const baseline = context.listDictionaries({}).page!;
  assert.deepEqual(baseline.pronunciation_dictionaries.map((item) => item.id), ["sim-dictionary-archived", "sim-dictionary"]);
  baseline.pronunciation_dictionaries[0].name = "External mutation";
  assert.equal(context.getDictionary("sim-dictionary-archived")!.name, "Archived Terms");
  const detail = context.getDictionary("sim-dictionary")!;
  detail.name = "External mutation";
  detail.rules[0].string_to_replace = "External mutation";
  assert.equal(context.getDictionary("sim-dictionary")!.rules[0].string_to_replace, "API");
  assert.equal(context.getDictionary("sim-dictionary")!.name, "Simulator Terms");
  assert.equal(context.getDictionary("missing"), undefined);
  const page = context.listDictionaries({ page_size: 1 }).page!;
  assert.equal(page.has_more, true);
  assert.equal(page.next_cursor, "1");
  assert.equal(context.listDictionaries({ cursor: page.next_cursor, page_size: 1 }).page!.pronunciation_dictionaries[0].id, "sim-dictionary");
  assert.deepEqual(context.listDictionaries({ cursor: "99" }).page!.pronunciation_dictionaries, []);
  assert.equal(context.listDictionaries({ include_archived: false }).page!.pronunciation_dictionaries.length, 1);
  assert.equal(context.listDictionaries({ sort: "name", sort_direction: "ascending" }).page!.pronunciation_dictionaries[0].name, "Archived Terms");
  assert.equal(context.listDictionaries({ sort_direction: "ASCENDING" }).page!.pronunciation_dictionaries[0].id, "sim-dictionary");
  for (const query of [{ cursor: "-1" }, { cursor: "1e2" }, { page_size: 0 }, { page_size: 101 }, { sort_direction: "sideways" }]) {
    assert.equal(typeof context.listDictionaries(query).error, "string");
  }
  await runner.run(scenarios.emptyDictionaries);
  assert.deepEqual(context.listDictionaries({}).page!.pronunciation_dictionaries, []);
  await runner.run(scenarios.reset);
  assert.equal(context.getDictionary("sim-dictionary")!.latest_version_rules_num, 2);
});

test("dictionary browsing dispatches pagination, archive filtering, missing IDs and reset", async () => {
  const app = await createDispatcherHarness();
  const other = await createDispatcherHarness();
  const read = async (path = "/v1/pronunciation-dictionaries") => {
    const response = await app.request(path);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type")!, /application\/json/);
    return response.json();
  };
  const baseline = await read();
  assert.deepEqual(baseline.pronunciation_dictionaries.map((item: { id: string }) => item.id), ["sim-dictionary-archived", "sim-dictionary"]);
  const detail = await read("/v1/pronunciation-dictionaries/sim-dictionary");
  assert.equal(detail.name, "Simulator Terms");
  assert.equal(detail.latest_version_rules_num, 2);
  assert.equal(detail.rules[0].type, "alias");
  assert.equal(detail.rules[1].type, "phoneme");
  assert.deepEqual(await read("/v1/pronunciation-dictionaries/sim-dictionary"), detail);
  const page = await read("/v1/pronunciation-dictionaries?page_size=1");
  assert.equal(page.has_more, true);
  const next = await read(`/v1/pronunciation-dictionaries?page_size=1&cursor=${page.next_cursor}`);
  assert.equal(next.pronunciation_dictionaries[0].id, "sim-dictionary");
  assert.equal(next.has_more, false);
  assert.equal(next.next_cursor, null);
  assert.equal((await read("/v1/pronunciation-dictionaries?include_archived=false")).pronunciation_dictionaries.length, 1);
  assert.equal((await read("/v1/pronunciation-dictionaries?sort=name&sort_direction=descending")).pronunciation_dictionaries[0].id, "sim-dictionary");
  for (const query of ["page_size=0", "page_size=101", "cursor=-1", "sort_direction=sideways"]) {
    assert.equal((await app.request(`/v1/pronunciation-dictionaries?${query}`)).status, 400);
  }
  const missing = await app.request("/v1/pronunciation-dictionaries/missing");
  assert.equal(missing.status, 404);
  assert.equal((await missing.json()).detail.status, "pronunciation_dictionary_not_found");
  await app.scenario("emptyDictionaries", "api");
  assert.deepEqual((await read()).pronunciation_dictionaries, []);
  assert.equal((await app.request("/v1/pronunciation-dictionaries/sim-dictionary")).status, 404);
  assert.equal((await (await other.request("/v1/pronunciation-dictionaries")).json()).pronunciation_dictionaries.length, 2);
  await app.scenario("reset", "api");
  assert.deepEqual(await read(), baseline);
});

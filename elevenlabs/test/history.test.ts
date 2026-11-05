import assert from "node:assert/strict";
import test from "node:test";
import { Context } from "../api/routes/_.context.js";
import * as scenarios from "../api/scenarios/index.js";
import type { Scenario } from "../api/types/index.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";

async function runScenario(context: Context, scenario: Scenario) {
  await scenario({ context, loadContext: () => { throw new Error("Unused by history scenarios"); }, routes: {}, route: () => undefined });
}

test("history listing filters and paginates isolated copies of scenario state", async () => {
  const context = new Context();
  assert.deepEqual(context.listHistory({}).page?.history, []);
  await runScenario(context, scenarios.startup);
  const baseline = context.listHistory({}).page!;
  assert.deepEqual(baseline.history.map((item) => item.history_item_id), ["sim-history-2", "sim-history-1"]);
  baseline.history[0].settings!.stability = 99;
  assert.equal(context.listHistory({}).page!.history[0].settings!.stability, 0.5);
  const page = context.listHistory({ page_size: 1 }).page!;
  assert.equal(page.has_more, true);
  assert.equal(page.last_history_item_id, "sim-history-2");
  assert.equal(page.scanned_until, 1735689602);
  const last = context.listHistory({ page_size: 1, start_after_history_item_id: page.last_history_item_id }).page!;
  assert.deepEqual(last.history.map((item) => item.history_item_id), ["sim-history-1"]);
  assert.equal(last.has_more, false);
  const empty = context.listHistory({ start_after_history_item_id: "sim-history-1" }).page!;
  assert.deepEqual(empty, { history: [], has_more: false, last_history_item_id: null, scanned_until: null });
  assert.deepEqual(context.listHistory({ voice_id: "sim-narrator", model_id: "eleven_multilingual_v2", search: "HELLO", source: "TTS", date_after_unix: 1735689601, date_before_unix: 1735689602 }).page!.history.map((item) => item.history_item_id), ["sim-history-1"]);
  assert.deepEqual(context.listHistory({ sort_direction: "asc" }).page!.history.map((item) => item.history_item_id), ["sim-history-1", "sim-history-2"]);
  assert.deepEqual(context.listHistory({ voice_id: "missing" }).page!.history, []);
  for (const page_size of [0, 1001, 1.5]) assert.equal(typeof context.listHistory({ page_size }).error, "string");
  assert.equal(typeof context.listHistory({ start_after_history_item_id: "missing" }).error, "string");
  await runScenario(context, scenarios.emptyHistory);
  assert.deepEqual(context.listHistory({}).page!.history, []);
  await runScenario(context, scenarios.reset);
  assert.equal(context.listHistory({}).page!.history.length, 2);
});

test("history endpoint returns deterministic pages, filters, errors, and reset state", async () => {
  const first = await createDispatcherHarness();
  const second = await createDispatcherHarness();
  const read = async (query = "") => {
    const response = await first.request(`/v1/history${query}`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type")!, /application\/json/);
    return response.json();
  };
  const baseline = await read();
  assert.deepEqual(baseline.history.map((item: { history_item_id: string }) => item.history_item_id), ["sim-history-2", "sim-history-1"]);
  assert.deepEqual(await read(), baseline);
  const page = await read("?page_size=1");
  assert.equal(page.has_more, true);
  const next = await read(`?page_size=1&start_after_history_item_id=${page.last_history_item_id}`);
  assert.equal(next.history[0].history_item_id, "sim-history-1");
  assert.equal(next.has_more, false);
  const filtered = await read("?voice_id=sim-narrator&model_id=eleven_multilingual_v2&source=TTS&search=HELLO&date_after_unix=1735689601&date_before_unix=1735689602");
  assert.equal(filtered.history.length, 1);
  assert.equal(filtered.history[0].history_item_id, "sim-history-1");
  assert.equal((await read("?date_before_unix=1735689601")).history.length, 0);
  assert.equal((await read("?sort_direction=asc")).history[0].history_item_id, "sim-history-1");
  for (const query of ["?page_size=0", "?page_size=1001", "?page_size=1.5", "?sort_direction=sideways", "?start_after_history_item_id=missing"]) {
    assert.equal((await first.request(`/v1/history${query}`)).status, 400);
  }
  await first.scenario("emptyHistory", "api");
  assert.deepEqual(await read(), { history: [], has_more: false, last_history_item_id: null, scanned_until: null });
  assert.equal((await (await second.request("/v1/history")).json()).history.length, 2);
  await first.scenario("reset", "api");
  assert.deepEqual(await read(), baseline);
});

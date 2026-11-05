import assert from "node:assert/strict";
import test from "node:test";
import { Context } from "../api/routes/_.context.js";
import { startup, reset } from "../api/scenarios/index.js";
import type { Scenario } from "../api/types/index.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";

async function runScenario(context: Context, scenario: Scenario) {
  await scenario({ context, loadContext: () => { throw new Error("Unused by history scenarios"); }, routes: {}, route: () => undefined });
}

test("history item reads isolate nested state and deletion affects only history", async () => {
  const context = new Context();
  assert.equal(context.getHistoryItem("missing"), undefined);
  assert.equal(context.deleteHistoryItem("missing"), false);
  await runScenario(context, startup);
  const item = context.getHistoryItem("sim-history-1")!;
  assert.equal(item.history_item_id, "sim-history-1");
  item.settings!.stability = 99;
  assert.equal(context.getHistoryItem("sim-history-1")!.settings!.stability, 0.5);
  const voices = context.listVoices();
  const models = context.listModels();
  const account = context.getUser();
  assert.equal(context.deleteHistoryItem("sim-history-1"), true);
  assert.equal(context.deleteHistoryItem("sim-history-1"), false);
  assert.equal(context.getHistoryItem("sim-history-1"), undefined);
  assert.deepEqual(context.listHistory({}).page!.history.map((value) => value.history_item_id), ["sim-history-2"]);
  assert.deepEqual(context.listVoices(), voices);
  assert.deepEqual(context.listModels(), models);
  assert.deepEqual(context.getUser(), account);
  await runScenario(context, reset);
  assert.equal(context.getHistoryItem("sim-history-1")!.text, item.text);
});

test("history item endpoints preserve historical metadata and expose deletion and reset", async () => {
  const first = await createDispatcherHarness();
  const second = await createDispatcherHarness();
  const read = await first.request("/v1/history/sim-history-1");
  assert.equal(read.status, 200);
  assert.match(read.headers.get("content-type")!, /application\/json/);
  const baseline = await read.json();
  assert.equal(baseline.history_item_id, "sim-history-1");
  const voices = await (await first.request("/v1/voices")).json();
  const models = await (await first.request("/v1/models")).json();
  const subscription = await (await first.request("/v1/user/subscription")).json();
  const deleted = await first.request("/v1/history/sim-history-1", { method: "DELETE" });
  assert.equal(deleted.status, 200);
  assert.deepEqual(await deleted.json(), { status: "ok" });
  for (const method of ["GET", "DELETE"]) {
    const missing = await first.request("/v1/history/sim-history-1", { method });
    assert.equal(missing.status, 404);
    assert.deepEqual(await missing.json(), { detail: { status: "history_item_not_found", message: "History item not found" } });
    assert.equal((await first.request("/v1/history/missing", { method })).status, 404);
  }
  assert.deepEqual((await (await first.request("/v1/history")).json()).history.map((item: { history_item_id: string }) => item.history_item_id), ["sim-history-2"]);
  assert.deepEqual(await (await first.request("/v1/voices")).json(), voices);
  assert.deepEqual(await (await first.request("/v1/models")).json(), models);
  assert.deepEqual(await (await first.request("/v1/user/subscription")).json(), subscription);
  assert.equal((await second.request("/v1/history/sim-history-1")).status, 200);
  await first.scenario("reset", "api");
  assert.deepEqual(await (await first.request("/v1/history/sim-history-1")).json(), baseline);
  assert.equal((await first.request("/v1/voices/sim-narrator", { method: "DELETE" })).status, 200);
  assert.deepEqual(await (await first.request("/v1/history/sim-history-1")).json(), baseline);
});

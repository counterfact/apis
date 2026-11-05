import assert from "node:assert/strict";
import test from "node:test";
import { Context } from "../api/routes/_.context.js";
import { startup, reset } from "../api/scenarios/index.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";

test("history item reads isolate nested state and deletion affects only history", async () => {
  const root = new Context();
  const runner = await createScenarioRunner(root);
  const context = runner.loadContext("/history");
  assert.equal(context.getHistoryItem("missing"), undefined);
  assert.equal(context.deleteHistoryItem("missing"), false);
  await runner.run(startup);
  const item = context.getHistoryItem("sim-history-1")!;
  assert.equal(item.history_item_id, "sim-history-1");
  item.settings!.stability = 99;
  assert.equal(context.getHistoryItem("sim-history-1")!.settings!.stability, 0.5);
  const voices = root.listVoices();
  const models = root.listModels();
  const account = root.getUser();
  assert.equal(context.deleteHistoryItem("sim-history-1"), true);
  assert.equal(context.deleteHistoryItem("sim-history-1"), false);
  assert.equal(context.getHistoryItem("sim-history-1"), undefined);
  assert.deepEqual(context.listHistory({}).page!.history.map((value) => value.history_item_id), ["sim-history-2"]);
  assert.deepEqual(root.listVoices(), voices);
  assert.deepEqual(root.listModels(), models);
  assert.deepEqual(root.getUser(), account);
  await runner.run(reset);
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

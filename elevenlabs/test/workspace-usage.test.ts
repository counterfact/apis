import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";

const day = 1_735_689_600_000;
const window = { start_time: day, end_time: day + 86_400_000 };
const path = "/v1/workspace/analytics/query/usage-by-product-over-time";

test("workspace usage context aggregates immutable ledger snapshots in UTC buckets", async () => {
  const runner = await createScenarioRunner();
  const context = runner.loadContext("/workspace/analytics");
  assert.deepEqual(context.queryUsage(window).value!.rows, []);
  await runner.run(scenarios.startup);
  const daily = context.queryUsage({ ...window, interval_seconds: 86400 }).value!;
  assert.deepEqual(daily, {
    columns: ["time", "product_type", "credits"],
    column_types: ["DateTime", "String", "Float"],
    column_units: ["ms", null, "credits"],
    rows: [[day, "text_to_speech", 1000]],
  });
  daily.rows[0][2] = 9999;
  assert.equal(context.queryUsage({ ...window, interval_seconds: 86400 }).value!.rows[0][2], 1000);
  assert.deepEqual(context.queryUsage({ ...window, group_by: [] }).value!.rows,
    [[day, 400], [day + 3_600_000, 600]]);
  assert.deepEqual(context.queryUsage({ ...window, interval_seconds: 3600, group_by: ["voice_id", "model"] }).value!.rows,
    [[day, "sim-narrator", "eleven_multilingual_v2", 400],
      [day + 3_600_000, "sim-assistant", "eleven_flash_v2_5", 600]]);
  assert.deepEqual(context.queryUsage({ start_time: day + 30_000, end_time: day + 3_600_000 }).value!.rows,
    [[day, "text_to_speech", 400]]);
  assert.deepEqual(context.queryUsage({ start_time: day + 3_600_000, end_time: day + 3_600_001 }).value!.rows,
    [[day + 3_600_000, "text_to_speech", 600]]);
  const before = structuredClone(context.usage);
  for (const input of [
    { ...window, start_time: 0 }, { ...window, end_time: day },
    { ...window, end_time: Number.MAX_SAFE_INTEGER + 1 },
    { ...window, start_time: day + 0.1 }, { ...window, interval_seconds: 0 },
    { ...window, interval_seconds: 604800 }, { ...window, time_zone: "America/New_York" },
    { ...window, group_by: ["region"] as const },
    { ...window, group_by: ["voice_id", "voice_id"] as const },
    { ...window, filters: [{ column: "voice_id", operation: "eq" as const, values: ["sim-narrator"] }] },
  ]) {
    assert.equal(typeof context.queryUsage(input as Parameters<typeof context.queryUsage>[0]).error, "string");
  }
  assert.deepEqual(context.usage, before);
  await runner.run(scenarios.emptyUsage);
  assert.deepEqual(context.queryUsage(window).value!.rows, []);
  await runner.run(scenarios.reset);
  assert.deepEqual(context.usage, before);
});

test("workspace analytics returns stable tabular usage, rejects unsupported queries, and resets independently", async () => {
  const first = await createDispatcherHarness();
  const second = await createDispatcherHarness();
  const request = (body: unknown) => first.request(path, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  const response = await request({ ...window, interval_seconds: 86400 });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type")!, /application\/json/);
  const baseline = await response.json();
  assert.deepEqual(baseline.rows, [[day, "text_to_speech", 1000]]);
  assert.equal(baseline.columns.length, baseline.column_types.length);
  assert.equal(baseline.columns.length, baseline.column_units.length);
  assert.deepEqual(await (await request({ ...window, interval_seconds: 86400, group_by: null, filters: [] })).json(), baseline);
  const grouped = await (await request({ ...window, interval_seconds: 86400, group_by: ["user_id"] })).json();
  assert.deepEqual(grouped.rows, [[day, "sim-user", 1000]]);
  for (const body of [{}, { ...window, interval_seconds: 30 }, { ...window, time_zone: "Europe/London" },
    { ...window, group_by: ["region"] }, { ...window, end_time: day - 1 },
    { ...window, filters: [{ column: "voice_id", operation: "eq", values: ["sim-narrator"] }] }]) {
    assert.equal((await request(body)).status, 400);
  }
  assert.deepEqual((await (await request({ start_time: day + 86_400_000, end_time: day + 172_800_000 })).json()).rows, []);
  assert.equal((await first.request("/v1/history/sim-history-1", { method: "DELETE" })).status, 200);
  assert.equal((await first.request("/v1/voices/sim-narrator", { method: "DELETE" })).status, 200);
  await first.scenario("quotaExhausted");
  assert.deepEqual(await (await request({ ...window, interval_seconds: 86400 })).json(), baseline);
  await first.scenario("emptyUsage");
  assert.deepEqual((await (await request(window)).json()).rows, []);
  const independent = await second.request(path, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...window, interval_seconds: 86400 }),
  });
  assert.equal(independent.status, 200);
  assert.deepEqual(await independent.json(), baseline);
  await first.scenario("reset");
  assert.deepEqual(await (await request({ ...window, interval_seconds: 86400 })).json(), baseline);
  assert.equal((await (await first.request("/v1/user")).json()).subscription.character_count, 1000);
  assert.equal((await (await first.request("/v1/voices")).json()).voices.length, 2);
});

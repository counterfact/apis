import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";
import { Context } from "../api/routes/convai/test-invocations/_.context.js";

test("invocation context filters historical records and cancels only pending runs", async () => {
  const runner = await createScenarioRunner();
  await runner.run(scenarios.startup);
  const context = runner.loadContext("/convai/test-invocations");
  assert.equal(new Context().records.size, 0);
  assert.equal(context.list().results.length, 2);
  const before = context.get("sim-test-invocation");
  assert.deepEqual(
    before.test_runs.map((r) => r.status),
    ["passed", "pending", "failed"],
  );
  assert.equal(
    context.list({
      test_id: "sim-test-tool",
      agent_id: "sim-agent",
      branch_id: "sim-main-branch",
      version_id: "sim-agent-version-main",
      created_by_user_id: "sim-member-narrator",
      start_time: 1735689600,
      end_time: 1735689600,
    }).results.length,
    1,
  );
  assert.equal(context.list({ search: "greeting" }).results.length, 1);
  const page = context.list({ page_size: 1 });
  assert.equal(page.next_cursor, "1");
  assert.equal(context.list({ cursor: page.next_cursor }).results.length, 1);
  before.test_runs[0].test_name = "changed";
  assert.equal(
    context.get("sim-test-invocation").test_runs[0].test_name,
    "Greeting response",
  );
  context.cancel("sim-test-invocation");
  const after = context.get("sim-test-invocation");
  assert.deepEqual(
    after.test_runs.map((r) => r.status),
    ["passed", "cancelled", "failed"],
  );
  assert.equal(after.cancelled, true);
  const summary = context.list({ test_id: "sim-test-tool" }).results[0];
  assert.deepEqual(
    [
      summary.passed_count,
      summary.pending_count,
      summary.failed_count,
      summary.cancelled_count,
    ],
    [1, 0, 1, 1],
  );
  assert.equal(
    summary.test_run_count,
    summary.passed_count +
      summary.pending_count +
      summary.failed_count +
      summary.cancelled_count,
  );
  assert.equal(summary.credits_used, null);
  assert.equal(summary.total_price, null);
  assert.equal(summary.runs_diverged_from_version, false);
  const clock = context.mutationTime;
  context.cancel("sim-test-invocation");
  assert.equal(context.mutationTime, clock);
  assert.deepEqual(context.get("sim-test-invocation"), after);
  const terminal = context.get("sim-test-invocation-complete");
  context.cancel("sim-test-invocation-complete");
  assert.equal(context.mutationTime, clock);
  assert.deepEqual(context.get("sim-test-invocation-complete"), terminal);
  assert.throws(() => context.cancel("missing"), {
    code: "test_invocation_not_found",
  });
  for (const q of [
    { page_size: 0 },
    { cursor: "x" },
    { start_time: "1" },
    { start_time: 2, end_time: 1 },
  ])
    assert.throws(() => context.list(q));
  await runner.run(scenarios.reset);
  assert.equal(
    context.list().results.find((r) => r.id === "sim-test-invocation")!
      .pending_count,
    1,
  );
  await runner.run(scenarios.testInvocationUsage);
  const usage = context.list({ test_id: "sim-test-tool" }).results[0];
  assert.equal(usage.credits_used, 12);
  assert.equal(usage.total_price, 0.003);
  assert.equal(usage.runs_diverged_from_version, true);
  assert.deepEqual(
    context.list().results.map((r) => r.id),
    ["sim-test-invocation", "sim-test-invocation-complete"],
  );
  usage.access_info!.creator_name = "changed";
  assert.equal(
    context.list({ test_id: "sim-test-tool" }).results[0].access_info!
      .creator_name,
    "Narrator",
  );
  assert.deepEqual(context.list({ cursor: "99" }).results, []);
  assert.deepEqual(context.list({ agent_id: "missing" }).results, []);
});

test("validated invocation list/detail/cancel preserve historical records and reset", async () => {
  const h = await createDispatcherHarness();
  const root = "/v1/convai/test-invocations";
  const page = await h.request(root + "?page_size=1");
  assert.equal(page.status, 200);
  assert.equal((await page.json()).has_more, true);
  const filtered = await h.request(
    root +
      "?agent_id=sim-agent&branch_id=sim-main-branch&version_id=sim-agent-version-main&test_id=sim-test-tool&start_time=1735689600&end_time=1735689600",
  );
  assert.equal(filtered.status, 200);
  assert.equal((await filtered.json()).results.length, 1);
  const cancellation = await h.request(root + "/sim-test-invocation/cancel", {
    method: "POST",
  });
  assert.equal(cancellation.status, 204);
  assert.equal(await cancellation.text(), "");
  const detail = await h.request(root + "/sim-test-invocation");
  assert.equal(detail.status, 200);
  assert.deepEqual(
    (await detail.json()).test_runs.map((r: { status: string }) => r.status),
    ["passed", "cancelled", "failed"],
  );
  const list = await (await h.request(root + "?test_id=sim-test-tool")).json();
  assert.equal(list.results[0].cancelled_count, 1);
  assert.equal(
    (await h.request(root + "/missing/cancel", { method: "POST" })).status,
    404,
  );
  assert.equal((await h.request(root + "/missing")).status, 404);
  assert.equal((await h.request(root + "?start_time=bad")).status, 400);
  assert.equal(
    (await h.request(root + "?start_time=2&end_time=1")).status,
    400,
  );
  assert.equal(
    (
      await h.request("/v1/convai/agent-testing/sim-test-tool", {
        method: "DELETE",
      })
    ).status,
    200,
  );
  assert.equal(
    (await h.request("/v1/convai/agents/sim-agent", { method: "DELETE" }))
      .status,
    204,
  );
  assert.equal(
    (
      await (
        await h.request(root + "?agent_id=sim-agent&test_id=sim-test-tool")
      ).json()
    ).results.length,
    1,
  );
  assert.equal((await h.request(root + "/sim-test-invocation")).status, 200);
  const other = await createDispatcherHarness();
  assert.equal(
    (await (await other.request(root + "/sim-test-invocation")).json())
      .cancelled,
    false,
  );
  await h.scenario("reset");
  assert.equal(
    (await (await h.request(root + "/sim-test-invocation")).json()).cancelled,
    false,
  );
  await h.scenario("emptyTestInvocations");
  assert.deepEqual((await (await h.request(root)).json()).results, []);
});

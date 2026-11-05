import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";
const request = {
  tests: [{ test_id: "sim-test-llm" }, { test_id: "sim-test-tool" }],
};
const post = (body: unknown) => ({
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});

test("context preserves snapshots and retries only selected runs with immutable attempt history", async () => {
  const runner = await createScenarioRunner();
  await runner.run(scenarios.startup);
  const c = runner.loadContext("/convai/test-invocations"),
    a = runner.loadContext("/convai/agents"),
    t = runner.loadContext("/convai/agent-testing");
  const input = structuredClone(request);
  const value = c.runTests("sim-agent", {
    ...input,
    repeat_count: 2,
    branch_id: "sim-agent-feature",
  });
  assert.equal(value.test_runs.length, 4);
  assert.ok(
    value.test_runs.every(
      (r) =>
        r.status === "pending" && r.version_id === "sim-agent-version-feature",
    ),
  );
  const id = value.id,
    runId = value.test_runs[0].test_run_id,
    snapshot = structuredClone(c.records.get(id)!);
  input.tests[0].test_id = "changed";
  value.test_runs[0].test_name = "changed";
  t.tests.get("sim-test-llm")!.definition.name = "Renamed";
  a.agents.get("sim-agent")!.configuration.name = "Renamed";
  assert.deepEqual(c.records.get(id), snapshot);
  c.complete(id, [
    { test_run_id: runId, status: "passed", credits_used: 5, price: 0.01 },
  ]);
  const completed = c.get(id).test_runs[0];
  c.cancel(id);
  const unselected = c.get(id).test_runs.slice(1);
  t.tests.delete("sim-test-llm");
  c.resubmit(id, { agent_id: "sim-agent", test_run_ids: [runId] });
  const retried = c.get(id);
  assert.equal(retried.test_runs[0].status, "pending");
  assert.equal(retried.test_runs[0].credits_used, null);
  assert.equal(retried.test_runs[0].test_name, "Greeting response");
  assert.deepEqual(retried.test_runs.slice(1), unselected);
  const history = c.history(id, runId);
  assert.equal(history.length, 1);
  assert.deepEqual(history[0].run, completed);
  assert.equal(
    history[0].agent!.name,
    snapshot.execution!.runs[runId].agent.name,
  );
  history[0].run.status = "failed";
  assert.equal(c.history(id, runId)[0].run.status, "passed");
  assert.equal(
    c.list({ agent_id: "sim-agent" }).results.find((r) => r.id === id)!
      .total_price,
    null,
  );
  const before = structuredClone(c.records),
    clock = c.mutationTime,
    next = c.nextInvocation;
  for (const body of [
    { agent_id: "missing", test_run_ids: [runId] },
    { agent_id: "sim-agent", test_run_ids: [runId, "missing"] },
    { agent_id: "sim-agent", test_run_ids: [runId, runId] },
  ])
    assert.throws(() => c.resubmit(id, body));
  assert.throws(() =>
    c.runTests("sim-agent", {
      tests: [{ test_id: "sim-test-tool" }, { test_id: "missing" }],
    }),
  );
  assert.deepEqual(c.records, before);
  assert.equal(c.mutationTime, clock);
  assert.equal(c.nextInvocation, next);
  await runner.run(scenarios.reset);
  const again = c.runTests("sim-agent", request);
  assert.equal(again.id, id);
  assert.equal(again.test_runs[0].test_name, "Greeting response");
});

test("context applies validated detached overrides, checks references and follows resets", async () => {
  const runner = await createScenarioRunner();
  await runner.run(scenarios.startup);
  const c = runner.loadContext("/convai/test-invocations"),
    a = runner.loadContext("/convai/agents");
  const before = structuredClone(a.agents);
  const value = c.runTests("sim-agent", {
    tests: [{ test_id: "sim-test-simulation" }],
    agent_config_override: {
      conversation_config: { agent: { first_message: "Ad hoc greeting" } },
      platform_settings: {},
    },
  });
  assert.equal(value.ran_against_draft, true);
  assert.equal(
    c.records.get(value.id)!.execution!.runs[value.test_runs[0].test_run_id]
      .agent.conversation_config.agent!.first_message,
    "Ad hoc greeting",
  );
  assert.deepEqual(a.agents, before);
  for (const body of [
    { tests: [] },
    { tests: request.tests, repeat_count: 0 },
    { tests: request.tests, branch_id: "missing" },
    {
      tests: request.tests,
      agent_config_override: {
        conversation_config: { tts: { voice_id: "missing" } },
        platform_settings: {},
      },
    },
    { tests: [{ test_id: "sim-test-llm", root_folder_id: "missing" }] },
  ])
    assert.throws(() => c.runTests("sim-agent", body));
  a.deleteAgent("sim-agent");
  assert.deepEqual(c.get(value.id), value);
  assert.throws(() =>
    c.resubmit(value.id, {
      agent_id: "sim-agent",
      test_run_ids: [value.test_runs[0].test_run_id],
    }),
  );
  await runner.run(scenarios.reset);
  assert.equal(c.runTests("sim-agent", request).test_runs.length, 2);
});

test("Dispatcher creates pending runs, completes, cancels and resubmits with real validation controls", async () => {
  const h = await createDispatcherHarness();
  const response = await h.request(
    "/v1/convai/agents/sim-agent/run-tests",
    post(request),
  );
  assert.equal(response.status, 200);
  const value = await response.json();
  assert.equal(value.test_runs.length, 2);
  assert.equal(value.test_runs[0].status, "pending");
  assert.equal(
    value.test_runs[0].test_info.success_condition,
    "Give a clear greeting",
  );
  const get = () =>
    h.request(`/v1/convai/test-invocations/${value.id}`).then((r) => r.json());
  assert.deepEqual(await get(), value);
  await h.scenario("completePendingTestInvocations");
  assert.equal((await get()).test_runs[0].status, "passed");
  const retry = await h.request(
    `/v1/convai/test-invocations/${value.id}/resubmit`,
    post({
      agent_id: "sim-agent",
      test_run_ids: [value.test_runs[0].test_run_id],
    }),
  );
  assert.equal(retry.status, 200);
  assert.equal((await get()).test_runs[0].status, "pending");
  assert.equal((await get()).test_runs[1].status, "passed");
  assert.equal(
    (
      await h.request(`/v1/convai/test-invocations/${value.id}/cancel`, {
        method: "POST",
      })
    ).status,
    204,
  );
  assert.equal((await get()).test_runs[0].status, "cancelled");
  assert.equal(
    (
      await h.request(
        "/v1/convai/agents/sim-agent/run-tests",
        post({ tests: "invalid" }),
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await h.request(
        `/v1/convai/test-invocations/${value.id}/resubmit`,
        post({ agent_id: "sim-agent", test_run_ids: "invalid" }),
      )
    ).status,
    400,
  );
  assert.equal(
    (await h.request("/v1/convai/agents/missing/run-tests", post(request)))
      .status,
    404,
  );
  assert.equal(
    (
      await h.request(
        `/v1/convai/test-invocations/${value.id}/resubmit`,
        post({ agent_id: "sim-agent", test_run_ids: ["missing"] }),
      )
    ).status,
    404,
  );
  await h.scenario("reset");
  assert.equal(
    (await h.request(`/v1/convai/test-invocations/${value.id}`)).status,
    404,
  );
});

test("repeated outcomes group explicitly and completion errors preserve costs and pending state", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/convai/test-invocations");
  const value = c.runTests("sim-agent", {
    tests: [
      {
        test_id: "sim-test-tool",
        root_folder_id: "sim-test-folder",
        root_folder_name: "Tool checks",
      },
    ],
    repeat_count: 2,
  });
  assert.equal(value.bucketing_status, "pending");
  assert.equal(value.result_groups![0].buckets[0].test_run_ids.length, 2);
  const ids = value.test_runs.map((run) => run.test_run_id);
  const before = structuredClone(c.records),
    clock = c.mutationTime;
  for (const results of [
    [
      { test_run_id: ids[0], status: "passed" },
      { test_run_id: "missing", status: "failed" },
    ],
    [{ test_run_id: ids[0], status: "passed", price: -1 }],
    [
      { test_run_id: ids[0], status: "passed" },
      { test_run_id: ids[0], status: "failed" },
    ],
  ])
    assert.throws(() => c.complete(value.id, results));
  assert.deepEqual(c.records, before);
  assert.equal(c.mutationTime, clock);
  c.complete(value.id, [
    { test_run_id: ids[0], status: "passed", credits_used: 2, price: 0.01 },
    { test_run_id: ids[1], status: "failed", credits_used: 3, price: 0.02 },
  ]);
  const completed = c.get(value.id);
  assert.equal(completed.bucketing_status, "completed");
  assert.deepEqual(
    completed.result_groups![0].buckets.map((b) => b.status),
    ["passed", "failed"],
  );
  assert.equal(
    c.list().results.find((row) => row.id === value.id)!.credits_used,
    5,
  );
  assert.equal(
    c.list().results.find((row) => row.id === value.id)!.total_price,
    0.03,
  );
  assert.throws(
    () => c.complete(value.id, [{ test_run_id: ids[0], status: "passed" }]),
    { code: "test_run_not_pending" },
  );
  c.resubmit(value.id, {
    agent_id: "sim-agent",
    test_run_ids: [ids[0]],
    branch_id: "sim-agent-feature",
  });
  const mixed = c.list().results.find((row) => row.id === value.id)!;
  assert.equal(mixed.runs_diverged_from_version, true);
  assert.equal(mixed.pending_count, 1);
  assert.equal(mixed.credits_used, 3);
  assert.equal(mixed.total_price, 0.02);
  assert.equal(c.history(value.id, ids[0])[0].price, 0.01);
  assert.equal(
    c.get(value.id).test_runs[1].last_updated_at_unix,
    completed.test_runs[1].last_updated_at_unix,
  );
  c.update(value.id, { name: "Renamed invocation" });
  assert.equal(c.history(value.id, ids[0])[0].run.status, "passed");
  c.resubmit("sim-test-invocation", {
    agent_id: "sim-agent",
    test_run_ids: ["sim-run-failed"],
  });
  assert.equal(c.get("sim-test-invocation").test_runs[2].status, "pending");
  assert.equal(
    c.history("sim-test-invocation", "sim-run-failed")[0].agent,
    null,
  );
  assert.equal(
    c.history("sim-test-invocation", "sim-run-failed")[0].test,
    null,
  );
  assert.equal(
    c.history("sim-test-invocation", "sim-run-failed")[0].request,
    null,
  );
});

test("Dispatcher keeps failed mutations atomic and supports default new agents plus detached overrides", async () => {
  const h = await createDispatcherHarness();
  const created = await h.request(
    "/v1/convai/agents/create",
    post({ conversation_config: {} }),
  );
  assert.equal(created.status, 200);
  const agent = await created.json();
  const run = await h.request(
    `/v1/convai/agents/${agent.agent_id}/run-tests`,
    post({
      tests: [{ test_id: "sim-test-simulation" }],
      agent_config_override: {
        conversation_config: { agent: { first_message: "Override" } },
        platform_settings: {},
        workflow: null,
      },
    }),
  );
  assert.equal(run.status, 200);
  const value = await run.json();
  assert.equal(value.ran_against_draft, true);
  assert.equal(value.test_runs[0].test_info.type, "simulation");
  const get = () =>
    h.request(`/v1/convai/test-invocations/${value.id}`).then((r) => r.json());
  for (const body of [
    {
      agent_id: agent.agent_id,
      test_run_ids: [value.test_runs[0].test_run_id, "missing"],
    },
    {
      agent_id: agent.agent_id,
      test_run_ids: [value.test_runs[0].test_run_id],
      branch_id: "missing",
    },
    {
      agent_id: agent.agent_id,
      test_run_ids: [value.test_runs[0].test_run_id],
      agent_config_override: {
        conversation_config: { tts: { voice_id: "missing" } },
        platform_settings: {},
      },
    },
  ]) {
    const bad = await h.request(
      `/v1/convai/test-invocations/${value.id}/resubmit`,
      post(body),
    );
    assert.ok(bad.status >= 400);
    assert.deepEqual(await get(), value);
  }
  assert.equal(
    (
      await h.request(
        `/v1/convai/test-invocations/${value.id}/resubmit`,
        post({
          agent_id: agent.agent_id,
          test_run_ids: [value.test_runs[0].test_run_id],
          agent_config_override: {
            conversation_config: { agent: { first_message: "Retry override" } },
            platform_settings: {},
          },
        }),
      )
    ).status,
    200,
  );
  assert.equal((await get()).ran_against_draft, true);
  const renamed = await h.request(`/v1/convai/test-invocations/${value.id}`, {
    ...post({ name: "Review run" }),
    method: "PATCH",
  });
  assert.equal(renamed.status, 200);
  assert.equal((await get()).name, "Review run");
  await h.request(`/v1/convai/agents/${agent.agent_id}`, { method: "DELETE" });
  const historical = await get();
  assert.equal(historical.id, value.id);
  assert.equal(
    (
      await h.request(
        `/v1/convai/test-invocations/${value.id}/resubmit`,
        post({
          agent_id: agent.agent_id,
          test_run_ids: [value.test_runs[0].test_run_id],
        }),
      )
    ).status,
    404,
  );
});

test("new executions validate live voice dependencies without changing historical snapshots", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/convai/test-invocations"),
    a = r.loadContext("/convai/agents");
  const first = c.runTests("sim-agent", request),
    before = structuredClone(c.records),
    clock = c.mutationTime;
  const voice = a.getAgent("sim-agent")!.conversation_config.tts!.voice_id!;
  r.loadContext("/voices").voices.delete(voice);
  assert.throws(() => c.runTests("sim-agent", request));
  assert.throws(() =>
    c.resubmit(first.id, {
      agent_id: "sim-agent",
      test_run_ids: [first.test_runs[0].test_run_id],
    }),
  );
  assert.deepEqual(c.records, before);
  assert.equal(c.mutationTime, clock);
  assert.deepEqual(c.get(first.id), first);
  await r.run(scenarios.reset);
  assert.equal(c.runTests("sim-agent", request).id, first.id);
});

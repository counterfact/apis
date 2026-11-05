import type { Scenario } from "../types/index.js";
export const emptyTestInvocations: Scenario = ($) => {
  const c = $.loadContext("/convai/test-invocations");
  c.records = new Map();
  c.mutationTime = 1735689700;
};
export const resetTestInvocations: Scenario = ($) => {
  emptyTestInvocations($);
  const c = $.loadContext("/convai/test-invocations");
  const access = {
    is_creator: true,
    creator_name: "Narrator",
    creator_email: "narrator@example.invalid",
    role: "admin" as const,
  };
  c.records.set("sim-test-invocation", {
    creator: "sim-member-narrator",
    title: "Greeting checks",
    access,
    value: {
      id: "sim-test-invocation",
      name: "Greeting checks",
      agent_id: "sim-agent",
      branch_id: "sim-main-branch",
      version_id: "sim-agent-version-main",
      created_at: 1735689600,
      cancelled: false,
      repeat_count: 1,
      test_runs: [
        {
          test_run_id: "sim-run-passed",
          test_invocation_id: "sim-test-invocation",
          agent_id: "sim-agent",
          branch_id: "sim-main-branch",
          version_id: "sim-agent-version-main",
          test_id: "sim-test-llm",
          test_name: "Greeting response",
          status: "passed",
          test_info: null,
          credits_used: null,
          last_updated_at_unix: 1735689600,
        },
        {
          test_run_id: "sim-run-pending",
          test_invocation_id: "sim-test-invocation",
          agent_id: "sim-agent",
          branch_id: "sim-main-branch",
          version_id: "sim-agent-version-main",
          test_id: "sim-test-tool",
          test_name: "Lookup tool selection",
          status: "pending",
          test_info: null,
          credits_used: null,
          last_updated_at_unix: 1735689600,
        },
        {
          test_run_id: "sim-run-failed",
          test_invocation_id: "sim-test-invocation",
          agent_id: "sim-agent",
          branch_id: "sim-main-branch",
          version_id: "sim-agent-version-main",
          test_id: "sim-test-simulation",
          test_name: "Shared support scenario",
          status: "failed",
          test_info: null,
          credits_used: null,
          last_updated_at_unix: 1735689600,
        },
      ],
    },
  });
  c.records.set("sim-test-invocation-complete", {
    creator: "sim-member-assistant",
    title: "Historical support check",
    access: { ...access, is_creator: false },
    value: {
      id: "sim-test-invocation-complete",
      agent_id: "sim-historical-agent",
      branch_id: null,
      version_id: null,
      created_at: 1735689601,
      cancelled: false,
      repeat_count: 1,
      test_runs: [
        {
          test_run_id: "sim-run-complete",
          test_invocation_id: "sim-test-invocation-complete",
          agent_id: "sim-historical-agent",
          test_id: "sim-historical-test",
          test_name: "Historical support check",
          status: "passed",
          test_info: null,
          credits_used: null,
          last_updated_at_unix: 1735689601,
        },
      ],
    },
  });
};

/** Synthetic historical usage metadata; no billing or provider call occurs. */
export const testInvocationUsage: Scenario = ($) => {
  const record = $.loadContext("/convai/test-invocations").records.get(
    "sim-test-invocation",
  );
  if (!record) throw new Error("Run reset before testInvocationUsage");
  record.value.test_runs[0].credits_used = 5;
  record.value.test_runs[2].credits_used = 7;
  record.value.test_runs[2].version_id = "sim-historical-version";
  record.finalRunPrices = { "sim-run-passed": 0.001, "sim-run-failed": 0.002 };
  const complete = $.loadContext("/convai/test-invocations").records.get(
    "sim-test-invocation-complete",
  );
  if (complete) complete.value.created_at = record.value.created_at;
};

import type { GetAgentResponseModel as Agent } from "../../../types/v1/components/schemas/GetAgentResponseModel.js";
import type { RunAgentTestsRequestModel as RunRequest } from "../../../types/v1/components/schemas/RunAgentTestsRequestModel.js";
import type { SingleTestRunRequestModel as TestRequest } from "../../../types/v1/components/schemas/SingleTestRunRequestModel.js";
import type { UnitTestRunResponseModel as Run } from "../../../types/v1/components/schemas/UnitTestRunResponseModel.js";
import type { StoredTest } from "../agent-testing/_.context.js";
type RunSnapshot = {
  agent: Agent;
  test: StoredTest["definition"];
  request: TestRequest;
  submission?: unknown;
};
type Attempt = Omit<RunSnapshot, "agent" | "test" | "request"> & {
  request: TestRequest | null;
  agent: Agent | null;
  test: StoredTest["definition"] | null;
  run: Run;
  price: number | null;
};
type Execution = {
  request: RunRequest | null;
  runs: Record<string, RunSnapshot & { history: Attempt[] }>;
};
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const text = (v: unknown): v is string => typeof v === "string" && !!v.trim();
import type { GetTestSuiteInvocationResponseModel as Invocation } from "../../../types/v1/components/schemas/GetTestSuiteInvocationResponseModel.js";
import type { TestInvocationSummaryResponseModel as Summary } from "../../../types/v1/components/schemas/TestInvocationSummaryResponseModel.js";
export type StoredInvocation = {
  execution?: Execution;
  value: Invocation;
  creator: string;
  title: string;
  access: Summary["access_info"];
  finalRunPrices?: Record<string, number | null>;
};
export class InvocationError extends Error {
  override name = "InvocationError";
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}
const invalid = (): never => {
  throw new InvocationError(400, "invalid_test_invocation_query");
};
const executionInvalid = (): never => {
  throw new InvocationError(400, "invalid_test_execution_request");
};
export class Context {
  agents?: () => import("../agents/_.context.js").Context;
  agentTests?: () => import("../agent-testing/_.context.js").Context;
  nextInvocation = 0;
  executionDefaults?: {
    maxTests: number;
    maxRepeat: number;
    creator: string;
    title: string;
    access: Summary["access_info"];
    bucketTitles: Record<Run["status"], string>;
    bucketReason: string;
  };
  private executionSettings() {
    if (
      !this.executionDefaults ||
      this.mutationTime === undefined ||
      !this.agents ||
      !this.agentTests
    )
      throw new Error("Run startup or reset");
    return this.executionDefaults;
  }
  private selectedAgent(id: string, branch: unknown, override: unknown) {
    const agents = this.agents!();
    if (branch != null && !text(branch)) return executionInvalid();
    // Published selector follows canonical branch/version ownership and agent deletion.
    let agent = agents.lifecycle!.select(id, {
      branch_id: branch as string | null,
    });
    if (override != null) {
      if (
        !object(override) ||
        Object.keys(override).some(
          (k) =>
            !["conversation_config", "platform_settings", "workflow"].includes(
              k,
            ),
        ) ||
        !object(override.conversation_config) ||
        !object(override.platform_settings)
      )
        return executionInvalid();
      const { workflow, ...settings } = override;
      const candidate = agents.prepareConfiguration(agent, {
        ...settings,
        ...(workflow == null ? {} : { workflow }),
      });
      if (!candidate) return executionInvalid();
      agent = candidate;
    }
    if (!agents.validateDependencies(agent)) return executionInvalid();
    return structuredClone(agent);
  }
  private testSnapshot(input: unknown, agent: Agent): RunSnapshot {
    if (
      !object(input) ||
      Object.keys(input).some(
        (k) =>
          ![
            "test_id",
            "workflow_node_id",
            "root_folder_id",
            "root_folder_name",
          ].includes(k),
      ) ||
      !text(input.test_id) ||
      ["workflow_node_id", "root_folder_id", "root_folder_name"].some(
        (k) => input[k] != null && !text(input[k]),
      )
    )
      return executionInvalid();
    const tests = this.agentTests!(),
      test = tests.tests.get(input.test_id);
    if (!test) throw new InvocationError(404, "agent_test_not_found");
    if (
      input.workflow_node_id != null &&
      !Object.hasOwn(
        agent.workflow?.nodes ?? {},
        input.workflow_node_id as string,
      )
    )
      return executionInvalid();
    if (input.root_folder_id != null) {
      const folder = tests.folders.get(input.root_folder_id as string);
      if (!folder)
        throw new InvocationError(404, "agent_test_folder_not_found");
      const seen = new Set<string>();
      let parent = test.parent;
      while (parent !== null && parent !== folder.id) {
        if (seen.has(parent)) return executionInvalid();
        seen.add(parent);
        parent = tests.folders.get(parent)?.parent ?? null;
      }
      if (
        parent !== folder.id ||
        (input.root_folder_name != null &&
          input.root_folder_name !== folder.name)
      )
        return executionInvalid();
    } else if (input.root_folder_name != null) return executionInvalid();
    return structuredClone({
      agent,
      test: test.definition,
      request: input as TestRequest,
    });
  }
  private pending(
    id: string,
    runId: string,
    snapshot: RunSnapshot,
    time: number,
    draft: boolean,
  ): Run {
    const { agent, test, request } = snapshot;
    const { id: _id, name: _name, ...info } = test;
    return structuredClone({
      test_run_id: runId,
      test_invocation_id: id,
      agent_id: agent.agent_id,
      branch_id: agent.branch_id ?? null,
      version_id: agent.version_id ?? null,
      ran_against_draft: draft,
      test_id: test.id,
      test_name: test.name,
      test_info: info,
      status: "pending",
      credits_used: null,
      last_updated_at_unix: time,
      workflow_node_id: request.workflow_node_id ?? null,
      root_folder_id: request.root_folder_id ?? null,
      root_folder_name: request.root_folder_name ?? null,
      environment:
        "simulation_environment" in test
          ? (test.simulation_environment ?? test.environment ?? "production")
          : (test.environment ?? "production"),
    });
  }
  runTests(agentId: string, input: unknown) {
    const settings = this.executionSettings();
    if (
      !object(input) ||
      Object.keys(input).some(
        (k) =>
          ![
            "name",
            "tests",
            "agent_config_override",
            "branch_id",
            "repeat_count",
          ].includes(k),
      ) ||
      !Array.isArray(input.tests) ||
      !input.tests.length ||
      input.tests.length > settings.maxTests ||
      (input.name != null && (!text(input.name) || input.name.length > 140))
    )
      return executionInvalid();
    const repeat = input.repeat_count ?? 1;
    if (
      input.repeat_count === null ||
      typeof repeat !== "number" ||
      !Number.isSafeInteger(repeat) ||
      repeat < 1 ||
      repeat > settings.maxRepeat ||
      repeat * input.tests.length > settings.maxTests
    )
      return executionInvalid();
    const agent = this.selectedAgent(
        agentId,
        input.branch_id,
        input.agent_config_override,
      ),
      snapshots = input.tests.map((t) => this.testSnapshot(t, agent));
    const request = structuredClone(input as RunRequest);
    for (const snapshot of snapshots)
      snapshot.submission = structuredClone(request);
    let number = this.nextInvocation,
      id: string;
    do {
      id = `sim-test-invocation-created-${++number}`;
    } while (this.records.has(id));
    const time = this.mutationTime! + 1,
      runs: Execution["runs"] = {},
      test_runs: Run[] = [];
    for (const snapshot of snapshots)
      for (let index = 0; index < repeat; index++) {
        const runId = `${id}-run-${test_runs.length + 1}`;
        runs[runId] = structuredClone({ ...snapshot, history: [] });
        test_runs.push(
          this.pending(
            id,
            runId,
            snapshot,
            time,
            input.agent_config_override != null,
          ),
        );
      }
    const record: StoredInvocation = {
      creator: settings.creator,
      title: (input.name as string) ?? settings.title,
      access: structuredClone(settings.access),
      execution: { request, runs },
      value: {
        id,
        name: (input.name as string) ?? null,
        agent_id: agentId,
        branch_id: agent.branch_id ?? null,
        version_id: agent.version_id ?? null,
        ran_against_draft: input.agent_config_override != null,
        repeat_count: repeat,
        created_at: time,
        cancelled: false,
        test_runs,
      },
    };
    this.groupResults(record);
    this.records.set(id, record);
    this.nextInvocation = number;
    this.mutationTime = time;
    return this.get(id);
  }
  private groupResults(record: StoredInvocation) {
    if ((record.value.repeat_count ?? 1) <= 1) return;
    const settings = this.executionSettings(),
      groups = new Map<string, Run[]>();
    for (const run of record.value.test_runs) {
      const key = JSON.stringify([run.test_id, run.workflow_node_id ?? null]);
      const group = groups.get(key) ?? [];
      group.push(run);
      groups.set(key, group);
    }
    record.value.bucketing_status = record.value.test_runs.some(
      (run) => run.status === "pending",
    )
      ? "pending"
      : "completed";
    record.value.result_groups = [...groups.values()].map((runs) => ({
      test_id: runs[0].test_id,
      test_name: runs[0].test_name ?? "Unknown Test",
      workflow_node_id: runs[0].workflow_node_id,
      buckets: (["pending", "passed", "failed", "cancelled"] as const).flatMap(
        (status) => {
          const matches = runs.filter((run) => run.status === status);
          return matches.length
            ? [
                {
                  test_run_ids: matches.map((run) => run.test_run_id),
                  title: settings.bucketTitles[status],
                  reason: settings.bucketReason,
                  status,
                },
              ]
            : [];
        },
      ),
    }));
  }
  history(id: string, runId: string) {
    const record = this.record(id);
    if (!record.value.test_runs.some((r) => r.test_run_id === runId))
      throw new InvocationError(404, "test_run_not_found");
    return structuredClone(record.execution?.runs[runId]?.history ?? []);
  }
  resubmit(id: string, input: unknown) {
    const settings = this.executionSettings(),
      record = this.record(id);
    if (
      !object(input) ||
      Object.keys(input).some(
        (k) =>
          ![
            "test_run_ids",
            "agent_config_override",
            "agent_id",
            "branch_id",
          ].includes(k),
      ) ||
      !text(input.agent_id) ||
      !Array.isArray(input.test_run_ids) ||
      !input.test_run_ids.length ||
      input.test_run_ids.length > settings.maxTests ||
      input.test_run_ids.some((id) => !text(id)) ||
      new Set(input.test_run_ids).size !== input.test_run_ids.length
    )
      return executionInvalid();
    if (
      record.value.agent_id != null &&
      input.agent_id !== record.value.agent_id
    )
      return executionInvalid();
    const agent = this.selectedAgent(
      input.agent_id,
      input.branch_id,
      input.agent_config_override,
    );
    const selected = input.test_run_ids.map((runId) => {
      const run = record.value.test_runs.find((r) => r.test_run_id === runId);
      if (!run) throw new InvocationError(404, "test_run_not_found");
      const old = record.execution?.runs[runId];
      const snapshot = old
        ? structuredClone({
            agent: old.agent,
            test: old.test,
            request: old.request,
            submission: old.submission,
          })
        : this.testSnapshot(
            {
              test_id: run.test_id,
              workflow_node_id: run.workflow_node_id,
              root_folder_id: run.root_folder_id,
              root_folder_name: run.root_folder_name,
            },
            agent,
          );
      if (
        snapshot.request.workflow_node_id != null &&
        !Object.hasOwn(
          agent.workflow?.nodes ?? {},
          snapshot.request.workflow_node_id,
        )
      )
        return executionInvalid();
      return { run, old, snapshot };
    });
    const candidate = structuredClone(record),
      time = this.mutationTime! + 1;
    candidate.execution ??= {
      request: null,
      runs: {},
    };
    for (const { run, old, snapshot } of selected) {
      const prior: Attempt = structuredClone({
        ...snapshot,
        agent: old?.agent ?? null,
        test: old?.test ?? null,
        request: old?.request ?? null,
        submission: old?.submission ?? null,
        run,
        price: record.finalRunPrices?.[run.test_run_id] ?? null,
      });
      const next = structuredClone({ ...snapshot, agent, submission: input });
      candidate.execution.runs[run.test_run_id] = {
        ...next,
        history: [...structuredClone(old?.history ?? []), prior],
      };
      const position = candidate.value.test_runs.findIndex(
        (r) => r.test_run_id === run.test_run_id,
      );
      candidate.value.test_runs[position] = this.pending(
        id,
        run.test_run_id,
        next,
        time,
        input.agent_config_override != null,
      );
      if (candidate.finalRunPrices)
        delete candidate.finalRunPrices[run.test_run_id];
    }
    candidate.value.agent_id = input.agent_id;
    candidate.value.branch_id = agent.branch_id ?? null;
    candidate.value.version_id = agent.version_id ?? null;
    candidate.value.ran_against_draft = input.agent_config_override != null;
    candidate.value.cancelled = candidate.value.test_runs.some(
      (r) => r.status === "cancelled",
    );
    this.groupResults(candidate);
    this.records.set(id, candidate);
    this.mutationTime = time;
    return this.get(id);
  }
  /** Apply explicit synthetic results, never inference or billing. */
  complete(id: string, input: unknown) {
    this.executionSettings();
    const record = this.record(id);
    if (
      !Array.isArray(input) ||
      !input.length ||
      new Set(input.map((r) => r?.test_run_id)).size !== input.length
    )
      return executionInvalid();
    const rows = input.map((item) => {
      if (
        !object(item) ||
        Object.keys(item).some(
          (k) =>
            !["test_run_id", "status", "credits_used", "price"].includes(k),
        ) ||
        !text(item.test_run_id) ||
        !["passed", "failed"].includes(item.status as string) ||
        ["credits_used", "price"].some(
          (k) =>
            item[k] != null &&
            (typeof item[k] !== "number" ||
              !Number.isFinite(item[k]) ||
              Number(item[k]) < 0),
        )
      )
        return executionInvalid();
      const run = record.value.test_runs.find(
        (r) => r.test_run_id === item.test_run_id,
      );
      if (!run) throw new InvocationError(404, "test_run_not_found");
      if (run.status !== "pending")
        throw new InvocationError(409, "test_run_not_pending");
      return { run, item };
    });
    const time = this.mutationTime! + 1;
    for (const { run, item } of rows) {
      run.status = item.status as "passed" | "failed";
      run.credits_used = (item.credits_used as number) ?? null;
      run.last_updated_at_unix = time;
      record.finalRunPrices ??= {};
      record.finalRunPrices![run.test_run_id] = (item.price as number) ?? null;
    }
    this.groupResults(record);
    this.mutationTime = time;
    return this.get(id);
  }

  update(id: string, input: unknown) {
    const record = this.record(id);
    if (
      input === null ||
      typeof input !== "object" ||
      Array.isArray(input) ||
      Object.keys(input).some((key) => key !== "name") ||
      !Object.hasOwn(input, "name")
    )
      return invalid();
    const name = (input as { name: unknown }).name;
    if (
      name !== null &&
      (typeof name !== "string" || !name.trim() || name.length > 140)
    )
      return invalid();
    record.value.name = name as string | null;
    return this.get(id);
  }

  records = new Map<string, StoredInvocation>();
  mutationTime?: number;
  private record(id: string) {
    const record = this.records.get(id);
    if (!record) throw new InvocationError(404, "test_invocation_not_found");
    return record;
  }
  get(id: string) {
    return structuredClone(this.record(id).value);
  }
  cancel(id: string) {
    const record = this.record(id);
    const pending = record.value.test_runs.filter(
      (run) => run.status === "pending",
    );
    if (!pending.length) return;
    if (this.mutationTime === undefined)
      throw new Error("Run startup or reset");
    const time = ++this.mutationTime;
    for (const run of pending) {
      run.status = "cancelled";
      run.last_updated_at_unix = time;
    }
    record.value.cancelled = true;
    this.groupResults(record);
  }
  private summary(record: StoredInvocation): Summary {
    const value = record.value,
      runs = value.test_runs;
    const costs = runs.flatMap((run) =>
      run.credits_used == null ? [] : [run.credits_used],
    );
    const prices = runs.flatMap((run) =>
      record.finalRunPrices?.[run.test_run_id] == null
        ? []
        : [record.finalRunPrices[run.test_run_id]!],
    );
    return structuredClone({
      id: value.id,
      name: value.name,
      agent_id: value.agent_id,
      branch_id: value.branch_id,
      version_id: value.version_id,
      ran_against_draft: value.ran_against_draft ?? false,
      runs_diverged_from_version:
        new Set(runs.map((run) => run.version_id ?? null)).size > 1,
      created_at_unix_secs: value.created_at ?? 0,
      title: value.name ?? record.title,
      repeat_count: value.repeat_count ?? 1,
      cancelled: value.cancelled ?? false,
      test_run_count: runs.length,
      passed_count: runs.filter((r) => r.status === "passed").length,
      failed_count: runs.filter((r) => r.status === "failed").length,
      pending_count: runs.filter((r) => r.status === "pending").length,
      cancelled_count: runs.filter((r) => r.status === "cancelled").length,
      credits_used: costs.length
        ? costs.reduce((sum, cost) => sum + cost, 0)
        : null,
      total_price: prices.length
        ? prices.reduce((sum, price) => sum + price, 0)
        : null,
      access_info: record.access,
    });
  }
  list(query: Record<string, unknown> = {}) {
    const size = query.page_size ?? 30,
      cursor = query.cursor ?? "0";
    const strings = [
      "agent_id",
      "branch_id",
      "created_by_user_id",
      "test_id",
      "version_id",
      "search",
    ];
    if (
      Object.keys(query).some(
        (k) =>
          ![
            ...strings,
            "start_time",
            "end_time",
            "page_size",
            "cursor",
          ].includes(k),
      ) ||
      typeof size !== "number" ||
      !Number.isInteger(size) ||
      size < 1 ||
      size > 100 ||
      typeof cursor !== "string" ||
      !/^(0|[1-9]\d*)$/.test(cursor) ||
      !Number.isSafeInteger(Number(cursor)) ||
      strings.some((k) => query[k] != null && typeof query[k] !== "string") ||
      ["start_time", "end_time"].some(
        (k) =>
          query[k] != null &&
          (typeof query[k] !== "number" ||
            !Number.isSafeInteger(query[k]) ||
            Number(query[k]) < 0),
      ) ||
      (query.start_time != null &&
        query.end_time != null &&
        Number(query.start_time) > Number(query.end_time))
    )
      return invalid();
    const rows = [...this.records.values()]
      .filter((record) => {
        const v = record.value;
        return (
          ["agent_id", "branch_id", "version_id"].every(
            (k) => query[k] == null || v[k as keyof Invocation] === query[k],
          ) &&
          (query.created_by_user_id == null ||
            record.creator === query.created_by_user_id) &&
          (query.test_id == null ||
            v.test_runs.some((run) => run.test_id === query.test_id)) &&
          (query.start_time == null ||
            (v.created_at ?? 0) >= Number(query.start_time)) &&
          (query.end_time == null ||
            (v.created_at ?? 0) <= Number(query.end_time)) &&
          (query.search == null ||
            [
              v.name ?? record.title,
              ...v.test_runs.map((run) => run.test_name ?? "Unknown Test"),
            ].some((name) =>
              name
                .toLowerCase()
                .includes((query.search as string).toLowerCase()),
            ))
        );
      })
      .sort(
        (a, b) =>
          (b.value.created_at ?? 0) - (a.value.created_at ?? 0) ||
          a.value.id.localeCompare(b.value.id),
      );
    const start = Number(cursor),
      end = start + size,
      has_more = end < rows.length;
    return {
      results: rows.slice(start, end).map((record) => this.summary(record)),
      has_more,
      next_cursor: has_more ? String(end) : null,
      meta: { total: rows.length, page_size: size },
    };
  }
}

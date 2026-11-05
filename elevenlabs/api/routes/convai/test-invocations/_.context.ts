import type { GetTestSuiteInvocationResponseModel as Invocation } from "../../../types/v1/components/schemas/GetTestSuiteInvocationResponseModel.js";
import type { TestInvocationSummaryResponseModel as Summary } from "../../../types/v1/components/schemas/TestInvocationSummaryResponseModel.js";
export type StoredInvocation = {
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
export class Context {
  update(id: string, input: unknown) {
    const record = this.record(id);
    if (input === null || typeof input !== "object" || Array.isArray(input) ||
        Object.keys(input).some(key => key !== "name") ||
        !Object.hasOwn(input, "name")) return invalid();
    const name = (input as { name: unknown }).name;
    if (name !== null && (typeof name !== "string" || !name.trim() || name.length > 140))
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

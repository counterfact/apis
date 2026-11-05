import type { Body_Get_Workspace_Usage_v1_workspace_analytics_query_usage_by_product_over_time_post as UsageQuery } from "../../../types/v1/components/schemas/Body_Get_Workspace_Usage_v1_workspace_analytics_query_usage_by_product_over_time_post.js";
import type { WorkspaceAnalyticsQueryResponseModel as UsageTable } from "../../../types/v1/components/schemas/WorkspaceAnalyticsQueryResponseModel.js";

type Group = "product_type" | "model" | "voice_id" | "user_id";
export type UsageRecord = Record<Group, string> & {
  time: number;
  credits: number;
};
type UsageResult =
  { value: UsageTable; error?: never } | { value?: never; error: string };
const groups = new Set<string>([
  "product_type",
  "model",
  "voice_id",
  "user_id",
]);

export class Context {
  requests: Array<{
    timestamp: number;
    request_id: string;
    method: string;
    path: string;
    status_code: number;
    user_id: string;
  }> = [];
  listRequests(input: unknown): UsageTable {
    const invalid = (): never => {
      throw Object.assign(
        new Error("Invalid or unsupported local request query"),
        {
          name: "WorkspaceRequestError",
          status: 400,
          code: "invalid_request_query",
        },
      );
    };
    if (!input || typeof input !== "object" || Array.isArray(input))
      return invalid();
    const q = input as Record<string, unknown>;
    if (
      Object.keys(q).some(
        (k) =>
          ![
            "start_time",
            "end_time",
            "limit",
            "sort",
            "filters",
            "search",
          ].includes(k),
      )
    )
      return invalid();
    const time = (v: unknown) =>
      v == null
        ? null
        : typeof v === "number" && Number.isSafeInteger(v) && v >= 1577836800000
          ? v
          : invalid();
    const start = time(q.start_time),
      end = time(q.end_time),
      limit = q.limit ?? 100,
      sort = q.sort ?? (end === null ? "asc" : "desc");
    if (
      (start === null && end === null) ||
      (start !== null && end !== null && start > end) ||
      !Number.isInteger(limit) ||
      Number(limit) < 1 ||
      Number(limit) > 1000 ||
      !["asc", "desc"].includes(String(sort)) ||
      (q.search != null && typeof q.search !== "string")
    )
      return invalid();
    const columns = [
      "timestamp",
      "request_id",
      "method",
      "path",
      "status_code",
      "user_id",
    ];
    const predicates: Array<(r: (typeof this.requests)[number]) => boolean> =
      [];
    if (q.filters != null) {
      if (!Array.isArray(q.filters)) return invalid();
      for (const f of q.filters) {
        if (
          !f ||
          typeof f !== "object" ||
          !columns.includes(f.column) ||
          !["in", "not_in", "le", "ge", "lt", "gt", "eq", "neq"].includes(
            f.operation,
          ) ||
          !Array.isArray(f.values) ||
          !f.values.length
        )
          return invalid();
        const numeric = ["timestamp", "status_code"].includes(f.column);
        if (
          f.values.some((v: unknown) =>
            numeric
              ? typeof v !== "number" || !Number.isFinite(v)
              : typeof v !== "string",
          ) ||
          (!["in", "not_in"].includes(f.operation) && f.values.length !== 1)
        )
          return invalid();
        predicates.push((r) => {
          const value = (r as unknown as Record<string, string | number>)[
              f.column
            ],
            v = f.values[0];
          switch (f.operation) {
            case "in":
              return f.values.includes(value);
            case "not_in":
              return !f.values.includes(value);
            case "eq":
              return value === v;
            case "neq":
              return value !== v;
            case "le":
              return value <= v;
            case "ge":
              return value >= v;
            case "lt":
              return value < v;
            case "gt":
              return value > v;
            default:
              return false;
          }
        });
      }
    }
    const search = String(q.search ?? "").toLowerCase();
    const rows = this.requests
      .filter(
        (r) =>
          (start === null || r.timestamp >= start) &&
          (end === null || r.timestamp <= end) &&
          predicates.every((p) => p(r)) &&
          Object.values(r).some((v) =>
            String(v).toLowerCase().includes(search),
          ),
      )
      .sort(
        (a, b) =>
          (sort === "asc" ? 1 : -1) * (a.timestamp - b.timestamp) ||
          a.request_id.localeCompare(b.request_id),
      )
      .slice(0, Number(limit))
      .map((r) =>
        columns.map(
          (k) => (r as unknown as Record<string, string | number>)[k],
        ),
      );
    return {
      columns,
      column_types: ["DateTime", "String", "String", "String", "Int", "String"],
      column_units: ["ms", null, null, null, null, null],
      rows,
    };
  }

  usage: UsageRecord[] = [];

  queryUsage(query: UsageQuery): UsageResult {
    const earliest = 1_577_836_800_000;
    if (![query.start_time, query.end_time].every((time) => Number.isSafeInteger(time) && time >= earliest)
      || query.start_time >= query.end_time) {
      return { error: "start_time and end_time must be safe integer milliseconds from 2020-01-01, with start_time before end_time" };
    }
    const interval = query.interval_seconds ?? 60;
    if (![60, 3600, 86400].includes(interval)) {
      return { error: "The simulator supports interval_seconds of 60, 3600, or 86400" };
    }
    if ((query.time_zone ?? "UTC") !== "UTC") return { error: "The simulator supports only the UTC time zone" };
    if (query.filters?.length) return { error: "The simulator does not support analytics filters" };
    const dimensions = query.group_by ?? ["product_type"];
    if (dimensions.some((group) => !groups.has(group)) || new Set(dimensions).size !== dimensions.length) {
      return { error: "group_by must contain distinct product_type, model, voice_id, or user_id fields" };
    }
    const selected = dimensions as Group[];
    const buckets = new Map<string, { time: number; values: string[]; credits: number }>();
    for (const record of this.usage) {
      if (record.time < query.start_time || record.time >= query.end_time) continue;
      const time = Math.floor(record.time / (interval * 1000)) * interval * 1000;
      const values = selected.map((group) => record[group]);
      const key = JSON.stringify([time, ...values]);
      const bucket = buckets.get(key);
      if (bucket) bucket.credits += record.credits;
      else buckets.set(key, { time, values, credits: record.credits });
    }
    const rows = [...buckets.values()].sort((a, b) => {
      const left = JSON.stringify(a.values);
      const right = JSON.stringify(b.values);
      return a.time - b.time || (left < right ? -1 : left > right ? 1 : 0);
    }).map(({ time, values, credits }) => [time, ...values, credits]);
    return { value: {
      columns: ["time", ...selected, "credits"],
      column_types: ["DateTime", ...selected.map(() => "String" as const), "Float"],
      column_units: ["ms", ...selected.map(() => null), "credits"],
      rows,
    } };
  }
}

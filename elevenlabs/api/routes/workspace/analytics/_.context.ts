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

  legacyCurrentUser?: string;

  legacyUsage(q: Record<string, unknown>): import("../../../types/v1/components/schemas/UsageCharactersResponseModel.js").UsageCharactersResponseModel {
    const invalid = (): never => {
      throw Object.assign(new Error("Invalid or unsupported local legacy usage query"), {
        name: "LegacyUsageError", status: 400, code: "invalid_legacy_usage_query",
      });
    };
    if (Object.keys(q).some(k => !["start_unix", "end_unix", "include_workspace_metrics", "breakdown_type", "aggregation_interval", "aggregation_bucket_size", "metric"].includes(k))) return invalid();
    const start = q.start_unix, end = q.end_unix;
    if (typeof start !== "number" || typeof end !== "number" ||
        !Number.isSafeInteger(start) || !Number.isSafeInteger(end) ||
        start < 0 || end < start || end > 8_640_000_000_000_000) return invalid();
    const workspace = q.include_workspace_metrics ?? false;
    const breakdown = q.breakdown_type ?? "none", interval = q.aggregation_interval ?? "day";
    const size = q.aggregation_bucket_size;
    if (typeof workspace !== "boolean" || (q.metric ?? "credits") !== "credits" ||
        typeof breakdown !== "string" || !["none", "voice", "model", "product_type", "user"].includes(breakdown) ||
        (breakdown === "user" && !workspace) ||
        typeof interval !== "string" || !["hour", "day", "week", "month", "cumulative"].includes(interval) ||
        (size != null && (typeof size !== "number" || !Number.isSafeInteger(size) || size <= 0 || !Number.isSafeInteger(size * 1000)))) return invalid();
    if (!workspace && !this.legacyCurrentUser) return invalid();
    const day = 86_400_000;
    const width = size != null ? Number(size) * 1000 : interval === "hour" ? 3_600_000 : interval === "day" ? day : interval === "week" ? 7 * day : null;
    const bucket = (t: number): number => {
      if (width !== null) return interval === "week" && size == null
        ? Math.floor((t + 3 * day) / width) * width - 3 * day
        : Math.floor(t / width) * width;
      if (interval === "cumulative") return start;
      const d = new Date(t); d.setUTCDate(1); d.setUTCHours(0, 0, 0, 0); return d.getTime();
    };
    const next = (t: number): number => {
      if (width !== null) return t + width;
      if (interval === "cumulative") return Infinity;
      const d = new Date(t); d.setUTCMonth(d.getUTCMonth() + 1); return d.getTime();
    };
    const time: number[] = [];
    for (let t = bucket(start); t <= end;) {
      if (time.length >= 10_000 || !Number.isFinite(t)) return invalid();
      time.push(t);
      const n = next(t);
      if (n > end) break;
      if (!Number.isFinite(n) || n <= t) return invalid();
      t = n;
    }
    const dimension = breakdown === "voice" ? "voice_id" : breakdown === "user" ? "user_id" : breakdown as Group;
    const selected = this.usage.filter(r => r.time >= start && r.time <= end && (workspace || r.user_id === this.legacyCurrentUser));
    const labels = breakdown === "none" ? ["All"] : [...new Set(selected.map(r => r[dimension]))].sort();
    if (labels.length * time.length > 100_000) return invalid();
    const usage: Record<string, number[]> = Object.fromEntries(labels.map(label => [label, time.map(() => 0)]));
    const indexes = new Map(time.map((t, i) => [t, i]));
    for (const record of selected) {
      const label = breakdown === "none" ? "All" : record[dimension];
      usage[label][indexes.get(bucket(record.time))!] += record.credits;
    }
    return { time, usage };
  }

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

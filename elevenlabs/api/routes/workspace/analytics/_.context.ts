import type { Body_Get_Workspace_Usage_v1_workspace_analytics_query_usage_by_product_over_time_post as UsageQuery } from "../../../types/v1/components/schemas/Body_Get_Workspace_Usage_v1_workspace_analytics_query_usage_by_product_over_time_post.js";
import type { WorkspaceAnalyticsQueryResponseModel as UsageTable } from "../../../types/v1/components/schemas/WorkspaceAnalyticsQueryResponseModel.js";

type Group = "product_type" | "model" | "voice_id" | "user_id";
export type UsageRecord = Record<Group, string> & { time: number; credits: number };
type UsageResult = { value: UsageTable; error?: never } | { value?: never; error: string };
const groups = new Set<string>(["product_type", "model", "voice_id", "user_id"]);

export class Context {
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

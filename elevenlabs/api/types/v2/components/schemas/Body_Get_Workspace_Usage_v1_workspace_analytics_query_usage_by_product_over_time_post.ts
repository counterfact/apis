import type { ColumnFilter } from "./ColumnFilter.js";
export type Body_Get_Workspace_Usage_v1_workspace_analytics_query_usage_by_product_over_time_post =
  {
    /**
     * Start of the time range as a Unix timestamp in milliseconds. Must be at least 2020-01-01.
     */
    start_time: number;
    /**
     * End of the time range as a Unix timestamp in milliseconds. Must be at least 2020-01-01.
     */
    end_time: number;
    /**
     * Bucket size in seconds. Each row in the response covers this many seconds of the selected time range. For example, pass 3600 for hourly buckets, 86400 for daily buckets, or 604800 for weekly buckets. Whether `time_zone` shifts bucket boundaries depends on this value: week multiples (e.g. 604800) are calendar weeks that start Monday at local midnight; whole-day multiples that are not whole weeks (e.g. 86400) align to local midnight; whole-hour multiples up to 24 hours (e.g. 3600, 14400) align to local hour boundaries from midnight; sub-hour values and other sizes remain UTC-anchored regardless of `time_zone`.
     * @default 60
     */
    interval_seconds?: number;
    group_by?: Array<
      | "product_type"
      | "model"
      | "voice_id"
      | "user_id"
      | "fiat_currency"
      | "fiat_charge_type"
      | "region"
      | "reporting_workspace_id"
      | "request_source"
      | "resource_id"
      | "subresource_id"
      | "request_queue_type"
      | "voice_multiplier"
      | "hashed_xi_api_key"
      | "billing_group_id"
      | "surface"
      | "actor"
    > | null;
    filters?: Array<ColumnFilter> | null;
    /**
     * IANA time zone identifier (e.g. 'America/New_York', 'Europe/London', 'UTC') used to align bucket boundaries for eligible `interval_seconds` values. Week multiples (e.g. 604800) are calendar weeks that start Monday at local midnight. Whole-day multiples that are not whole weeks start at local midnight; whole-hour multiples up to 24 hours align to local hour boundaries from midnight. Sub-hour intervals and other bucket sizes remain UTC-anchored regardless of this setting. Defaults to UTC.
     * @default "UTC"
     */
    time_zone?: string;
  };

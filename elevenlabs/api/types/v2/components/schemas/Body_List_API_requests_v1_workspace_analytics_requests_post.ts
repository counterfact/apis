import type { ColumnFilter } from "./ColumnFilter.js";
export type Body_List_API_requests_v1_workspace_analytics_requests_post = {
  /**
   * Start of the time range as a Unix timestamp in milliseconds.
   */
  start_time?: number | null;
  /**
   * End of the time range as a Unix timestamp in milliseconds.
   */
  end_time?: number | null;
  /**
   * @default 100
   */
  limit?: number;
  /**
   * Optional timestamp sort direction. If omitted, defaults to desc when end_time is provided, otherwise asc.
   */
  sort?: ("asc" | "desc") | null;
  filters?: Array<ColumnFilter> | null;
  search?: string | null;
};

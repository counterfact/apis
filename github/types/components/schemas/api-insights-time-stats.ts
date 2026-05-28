/**
 * API Insights usage time stats for an organization
 */
export type api_insights_time_stats = Array<{
  timestamp?: string;
  /**
   * @format int64
   */
  total_request_count?: number;
  /**
   * @format int64
   */
  rate_limited_request_count?: number;
}>;

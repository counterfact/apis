/**
 * API Insights usage summary stats for an organization
 */
export type api_insights_summary_stats = {
  /**
   * The total number of requests within the queried time period
   * @format int64
   */
  total_request_count?: number;
  /**
   * The total number of requests that were rate limited within the queried time period
   * @format int64
   */
  rate_limited_request_count?: number;
};

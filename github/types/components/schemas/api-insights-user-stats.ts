/**
 * API Insights usage stats for a user
 */
export type api_insights_user_stats = Array<{
  actor_type?: string;
  actor_name?: string;
  /**
   * @format int64
   */
  actor_id?: number;
  /**
   * @format int64
   */
  integration_id?: number;
  /**
   * @format int64
   */
  oauth_application_id?: number;
  total_request_count?: number;
  rate_limited_request_count?: number;
  last_rate_limited_timestamp?: string;
  last_request_timestamp?: string;
}>;

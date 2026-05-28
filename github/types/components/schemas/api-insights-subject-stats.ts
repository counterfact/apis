/**
 * API Insights usage subject stats for an organization
 */
export type api_insights_subject_stats = Array<{
  subject_type?: string;
  subject_name?: string;
  /**
   * @format int64
   */
  subject_id?: number;
  total_request_count?: number;
  rate_limited_request_count?: number;
  last_rate_limited_timestamp?: string;
  last_request_timestamp?: string;
}>;

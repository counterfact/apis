/**
 * Links to download the latest Copilot usage metrics report for an enterprise/organization.
 */
export type copilot_usage_metrics_28_day_report = {
  /**
   * The URLs to download the latest Copilot usage metrics report for the enterprise/organization.
   */
  download_links: Array<string>;
  /**
   * The start date of the report period in `YYYY-MM-DD` format.
   * @format date
   */
  report_start_day: string;
  /**
   * The end date of the report period in `YYYY-MM-DD` format.
   * @format date
   */
  report_end_day: string;
};

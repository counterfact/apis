/**
 * Links to download the Copilot usage metrics report for an enterprise/organization for a specific day.
 */
export type copilot_usage_metrics_1_day_report = {
  /**
   * The URLs to download the Copilot usage metrics report for the enterprise/organization for the specified day.
   */
  download_links: Array<string>;
  /**
   * The day of the report in `YYYY-MM-DD` format.
   * @format date
   */
  report_day: string;
};

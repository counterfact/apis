export type AlertingPagerDutyNotifierResponse = {
  /**
   * @default "integration"
   */
  type?: "integration";
  /**
   * @default "pagerduty"
   */
  integration_type?: "pagerduty";
  connection_id: string;
};

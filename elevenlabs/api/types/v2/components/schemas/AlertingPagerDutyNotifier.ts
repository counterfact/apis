export type AlertingPagerDutyNotifier = {
  /**
   * @default "integration"
   */
  type?: "integration";
  /**
   * @default "pagerduty"
   */
  integration_type?: "pagerduty";
  /**
   * ID of the workspace integration connection to deliver alert lifecycle notifications to. The connection's integration must have the monitoring capability and match ``integration_type``.
   */
  connection_id: string;
};

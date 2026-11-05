export type AlertingSlackNotifierResponse = {
  /**
   * @default "integration"
   */
  type?: "integration";
  /**
   * @default "slack"
   */
  integration_type?: "slack";
  connection_id: string;
  channel_id: string;
};

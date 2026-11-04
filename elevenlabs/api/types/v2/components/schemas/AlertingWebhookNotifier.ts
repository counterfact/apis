export type AlertingWebhookNotifier = {
  /**
   * @default "webhook"
   */
  type?: "webhook";
  /**
   * ID of the workspace webhook to deliver alert lifecycle notifications to.
   */
  webhook_id: string;
};

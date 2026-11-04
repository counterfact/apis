import type { AlertingWebhookMethod } from "./AlertingWebhookMethod.js";
import type { AlertingWebhookHeader } from "./AlertingWebhookHeader.js";
export type InternalAlertingWebhookNotifier = {
  /**
   * @default "webhook"
   */
  type?: "webhook";
  /**
   * The URL to send alert lifecycle notifications to.
   */
  url: string;
  /**
   * HTTP method used when calling the webhook URL.
   * @default "POST"
   */
  method?: AlertingWebhookMethod;
  /**
   * Custom request headers sent with every notification. Secret header values are encrypted at rest and never returned by the API.
   */
  headers?: Array<AlertingWebhookHeader>;
};

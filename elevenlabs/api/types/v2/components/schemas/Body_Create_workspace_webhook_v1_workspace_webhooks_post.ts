import type { WebhookHMACSettings } from "./WebhookHMACSettings.js";
export type Body_Create_workspace_webhook_v1_workspace_webhooks_post = {
  /**
   * Webhook settings object containing auth_type and corresponding configuration
   */
  settings: WebhookHMACSettings;
};

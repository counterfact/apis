import type { WorkspaceWebhookResponseModel } from "./WorkspaceWebhookResponseModel.js";
/**
 * @example {"webhooks":[{"auth_type":"hmac","created_at_unix":123456789,"is_auto_disabled":false,"is_disabled":false,"most_recent_failure_error_code":404,"most_recent_failure_timestamp":123456799,"name":"My Webhook","usage":[{"usage_type":"ConvAI Settings"}],"webhook_id":"123","webhook_url":"https://elevenlabs.io/example-callback-url"}]}
 */
export type WorkspaceWebhookListResponseModel = {
  /**
   * List of webhooks currently configured for the workspace
   */
  webhooks: Array<WorkspaceWebhookResponseModel>;
};

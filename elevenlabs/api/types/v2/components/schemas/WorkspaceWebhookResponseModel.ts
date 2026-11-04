import type { WebhookAuthMethodType } from "./WebhookAuthMethodType.js";
import type { WorkspaceWebhookUsageResponseModel } from "./WorkspaceWebhookUsageResponseModel.js";
import type { WorkspaceWebhookEventType } from "./WorkspaceWebhookEventType.js";
export type WorkspaceWebhookResponseModel = {
  /**
   * The display name for this webhook.
   */
  name: string;
  /**
   * The unique ID for this webhook.
   */
  webhook_id: string;
  /**
   * The HTTPS callback URL that is called when this webhook is triggered in the platform.
   */
  webhook_url: string;
  /**
   * Whether the webhook has been manually disabled by a user.
   */
  is_disabled: boolean;
  /**
   * Whether the webhook has been automatically disabled due to repeated consecutive failures over a long period of time.
   */
  is_auto_disabled: boolean;
  /**
   * Original creation time of the webhook.
   */
  created_at_unix: number;
  /**
   * The authentication mode used to secure the webhook.
   */
  auth_type: WebhookAuthMethodType;
  /**
   * The list of products that are currently configured to trigger this webhook.
   */
  usage?: Array<WorkspaceWebhookUsageResponseModel> | null;
  /**
   * The workspace-level events this webhook is currently subscribed to. Only populated when usages are requested.
   */
  events?: Array<WorkspaceWebhookEventType> | null;
  /**
   * The most recent error code returned from the callback URL.
   */
  most_recent_failure_error_code?: number | null;
  /**
   * The most recent time the webhook failed, failures are any non-200 codes returned by the callback URL.
   */
  most_recent_failure_timestamp?: number | null;
};

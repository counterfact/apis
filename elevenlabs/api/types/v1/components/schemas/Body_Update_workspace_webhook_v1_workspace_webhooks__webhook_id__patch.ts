import type { WorkspaceWebhookEventType } from "./WorkspaceWebhookEventType.js";
export type Body_Update_workspace_webhook_v1_workspace_webhooks__webhook_id__patch =
  {
    /**
     * Whether to disable or enable the webhook
     */
    is_disabled: boolean;
    /**
     * The display name of the webhook (used for display purposes only).
     */
    name: string;
    /**
     * Whether to enable automatic retries for transient failures (5xx, 429, timeout)
     */
    retry_enabled?: boolean | null;
    /**
     * A list of request headers to include with the webhook delivery (optional)
     */
    request_headers?: { [key: string]: string } | null;
    /**
     * The complete set of workspace-level events this webhook should be subscribed to. The webhook is added to the events in the list and removed from any not in the list. Omit to leave the current event subscriptions unchanged.
     */
    events?: Array<WorkspaceWebhookEventType> | null;
  };

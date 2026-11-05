import type { WorkspaceWebhookResponseModel as Webhook } from "../../../types/v1/components/schemas/WorkspaceWebhookResponseModel.js";
import type { Body_Create_workspace_webhook_v1_workspace_webhooks_post as CreateWebhook } from "../../../types/v1/components/schemas/Body_Create_workspace_webhook_v1_workspace_webhooks_post.js";
import type { Body_Update_workspace_webhook_v1_workspace_webhooks__webhook_id__patch as UpdateWebhook } from "../../../types/v1/components/schemas/Body_Update_workspace_webhook_v1_workspace_webhooks__webhook_id__patch.js";

type Configuration = Webhook & {
  webhook_secret: string;
  request_headers: Record<string, string>;
  retry_enabled: boolean;
};

export class Context {
  webhooks = new Map<string, Configuration>();
  nextWebhookNumber = 0;
  creationTimeUnix = 0;

  listWebhooks(includeUsages = false) {
    // Explicit public projection: secrets and delivery configuration are never listed.
    const webhooks = [...this.webhooks.values()].map((stored): Webhook => {
      const { name, webhook_id, webhook_url, is_disabled, is_auto_disabled,
        created_at_unix, auth_type, most_recent_failure_error_code, most_recent_failure_timestamp } = stored;
      return { name, webhook_id, webhook_url, is_disabled, is_auto_disabled,
        created_at_unix, auth_type, most_recent_failure_error_code, most_recent_failure_timestamp,
        ...(includeUsages ? { usage: stored.usage ?? [], events: stored.events ?? [] } : {}) };
    });
    return { webhooks: structuredClone(webhooks) };
  }

  createWebhook({ settings }: CreateWebhook) {
    let webhook_id: string;
    do { webhook_id = `sim-webhook-created-${++this.nextWebhookNumber}`; }
    while (this.webhooks.has(webhook_id));
    const webhook_secret = `sim-webhook-secret-${this.nextWebhookNumber}`;
    this.webhooks.set(webhook_id, {
      webhook_id, webhook_secret, name: settings.name, webhook_url: settings.webhook_url,
      auth_type: settings.auth_type, is_disabled: false, is_auto_disabled: false,
      created_at_unix: this.creationTimeUnix + this.nextWebhookNumber,
      request_headers: structuredClone(settings.request_headers ?? {}), retry_enabled: false,
      usage: [], events: [], most_recent_failure_error_code: null, most_recent_failure_timestamp: null,
    });
    return { webhook_id, webhook_secret };
  }

  updateWebhook(id: string, input: UpdateWebhook) {
    const webhook = this.webhooks.get(id);
    if (!webhook) return undefined;
    webhook.name = input.name;
    webhook.is_disabled = input.is_disabled;
    if (input.retry_enabled != null) webhook.retry_enabled = input.retry_enabled;
    if (input.request_headers != null) webhook.request_headers = structuredClone(input.request_headers);
    if (input.events != null) webhook.events = structuredClone(input.events);
    return { status: "ok" };
  }

  deleteWebhook(id: string) {
    return this.webhooks.delete(id) ? { status: "ok" } : undefined;
  }
}

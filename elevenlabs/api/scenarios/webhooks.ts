import type { Scenario } from "../types/index.js";

export const emptyWebhooks: Scenario = ($) => {
  const context = $.loadContext("/workspace/webhooks");
  context.webhooks = new Map();
  context.nextWebhookNumber = 0;
  context.creationTimeUnix = 1_735_689_600;
};

export const resetWebhooks: Scenario = ($) => {
  emptyWebhooks($);
  $.loadContext("/workspace/webhooks").webhooks.set("sim-webhook", {
    webhook_id: "sim-webhook", name: "Simulator Webhook", webhook_url: "https://example.invalid/simulator-webhook",
    auth_type: "hmac", webhook_secret: "sim-webhook-fixture-secret", request_headers: {}, retry_enabled: false,
    is_disabled: false, is_auto_disabled: false, created_at_unix: 1_735_689_600,
    usage: [], events: ["speech_to_text"], most_recent_failure_error_code: null, most_recent_failure_timestamp: null,
  });
};

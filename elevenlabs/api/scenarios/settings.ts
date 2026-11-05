import type { Scenario } from "../types/index.js";

export const resetSettings: Scenario = ($) => {
  const context = $.loadContext("/convai/settings");
  context.settings = {
    conversation_initiation_client_data_webhook: null,
    webhooks: { post_call_webhook_id: null, events: ["transcript"], transcript_format: "json", exclude_transcript: false, send_audio: false },
    can_use_mcp_servers: false, rag_retention_period_days: 10,
    conversation_embedding_retention_days: null, default_livekit_stack: "standard",
  };
  context.dashboard = { charts: [{ name: "Call success", type: "call_success" }] };
};

export const alternateSettings: Scenario = ($) => {
  const context = $.loadContext("/convai/settings");
  context.settings = {
    conversation_initiation_client_data_webhook: { url: "https://example.invalid/initiation", request_headers: {} },
    webhooks: { post_call_webhook_id: "sim-webhook", events: [], transcript_format: "opentelemetry", exclude_transcript: true, send_audio: null },
    can_use_mcp_servers: true, rag_retention_period_days: 30,
    conversation_embedding_retention_days: 90, default_livekit_stack: "static",
  };
  context.dashboard = { charts: [] };
};

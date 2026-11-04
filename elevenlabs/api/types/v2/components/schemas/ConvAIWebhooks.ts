import type { WebhookEventType } from "./WebhookEventType.js";
import type { WebhookTranscriptFormat } from "./WebhookTranscriptFormat.js";
export type ConvAIWebhooks = {
  post_call_webhook_id?: string | null;
  /**
   * List of event types to send via webhook. Options: transcript, audio, call_initiation_failure, answering_machine_detection, unredacted_transcript, unredacted_audio.
   */
  events?: Array<WebhookEventType>;
  /**
   * Format for transcript webhooks.
   * @default "json"
   */
  transcript_format?: WebhookTranscriptFormat;
  /**
   * When true, JSON post-call transcription webhooks omit the turn-by-turn transcript. Analysis, metadata, and other conversation fields are still sent. Ignored for OpenTelemetry transcript format.
   * @default false
   */
  exclude_transcript?: boolean;
  /**
   * DEPRECATED: Use 'events' field instead. Whether to send audio data with post-call webhooks for ConvAI conversations
   * @deprecated
   */
  send_audio?: boolean | null;
};

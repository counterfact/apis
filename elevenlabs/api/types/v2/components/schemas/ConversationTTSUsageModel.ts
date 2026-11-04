import type { ConversationVoiceUsageModel } from "./ConversationVoiceUsageModel.js";
/**
 * Aggregated TTS usage for a conversation (analytics-only, not billing).
 */
export type ConversationTTSUsageModel = {
  primary_tts_model?: string | null;
  /**
   * @default 0
   */
  total_audio_output_seconds?: number;
  /**
   * @default 0
   */
  total_characters?: number;
  per_voice_usage?: Array<ConversationVoiceUsageModel>;
};

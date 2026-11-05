/**
 * Aggregated ASR usage for a conversation (analytics-only, not billing).
 */
export type ConversationASRUsageModel = {
  asr_model?: string | null;
  /**
   * @default 0
   */
  total_transcription_calls?: number;
  /**
   * @default 0
   */
  total_audio_input_seconds?: number;
};

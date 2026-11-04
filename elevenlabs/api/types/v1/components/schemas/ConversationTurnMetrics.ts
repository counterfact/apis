import type { MetricRecord } from "./MetricRecord.js";
export type ConversationTurnMetrics = {
  metrics?: { [key: string]: MetricRecord };
  convai_asr_provider?: string | null;
  convai_tts_model?: string | null;
  convai_tts_cascade?: string | null;
  voice_id?: string | null;
};

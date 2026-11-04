import type { TTSModelFamily } from "./TTSModelFamily.js";
import type { TTSOptimizeStreamingLatency } from "./TTSOptimizeStreamingLatency.js";
export type SupportedVoice = {
  label: string;
  voice_id: string;
  description?: string | null;
  language?: string | null;
  model_family?: TTSModelFamily | null;
  optimize_streaming_latency?: TTSOptimizeStreamingLatency | null;
  stability?: number | null;
  speed?: number | null;
  similarity_boost?: number | null;
  clone_strength?: number | null;
};

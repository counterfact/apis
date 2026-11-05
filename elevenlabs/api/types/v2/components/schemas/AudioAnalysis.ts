import type { AudioAnalysisResult } from "./AudioAnalysisResult.js";
export type AudioAnalysis = {
  status: "processing" | "completed" | "failed";
  data: AudioAnalysisResult | null;
  updated_at_ms?: number;
};

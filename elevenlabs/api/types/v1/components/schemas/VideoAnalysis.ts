import type { VideoAnalysisResult } from "./VideoAnalysisResult.js";
export type VideoAnalysis = {
  status: "processing" | "completed" | "failed";
  data: VideoAnalysisResult | null;
  updated_at_ms?: number;
};

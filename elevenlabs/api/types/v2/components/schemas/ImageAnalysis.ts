import type { ImageAnalysisResult } from "./ImageAnalysisResult.js";
export type ImageAnalysis = {
  status: "processing" | "completed" | "failed";
  data: ImageAnalysisResult | null;
  updated_at_ms?: number;
};

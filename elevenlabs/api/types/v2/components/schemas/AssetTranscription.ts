import type { AssetTranscriptionData } from "./AssetTranscriptionData.js";
export type AssetTranscription = {
  status: "processing" | "completed" | "failed";
  data: AssetTranscriptionData | null;
  updated_at_ms?: number;
};

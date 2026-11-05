import type { AudioSegment } from "./AudioSegment.js";
import type { AudioKeyMoment } from "./AudioKeyMoment.js";
export type AudioAnalysisResult = {
  title: string;
  description: string;
  content_type?: string | null;
  overall_pacing?: string | null;
  segments?: Array<AudioSegment>;
  key_moments?: Array<AudioKeyMoment>;
};

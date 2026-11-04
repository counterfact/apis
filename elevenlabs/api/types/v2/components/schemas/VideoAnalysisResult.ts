import type { VideoSubject } from "./VideoSubject.js";
import type { VideoSegment } from "./VideoSegment.js";
import type { VideoKeyMoment } from "./VideoKeyMoment.js";
export type VideoAnalysisResult = {
  title: string;
  description: string;
  content_type?: string | null;
  overall_pacing?: string | null;
  subjects?: Array<VideoSubject>;
  segments?: Array<VideoSegment>;
  key_moments?: Array<VideoKeyMoment>;
};

import type { SegmentSubtitleFrame } from "./SegmentSubtitleFrame.js";
import type { DubbingMediaReference } from "./DubbingMediaReference.js";
export type DubbedSegment = {
  start_time: number;
  end_time: number;
  text: string | null;
  subtitles: Array<SegmentSubtitleFrame>;
  audio_stale: boolean;
  media_ref: DubbingMediaReference | null;
};

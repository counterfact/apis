import type { SegmentSubtitleFrame } from "./SegmentSubtitleFrame.js";
import type { DubbedSegment } from "./DubbedSegment.js";
export type SpeakerSegment = {
  id: string;
  start_time: number;
  end_time: number;
  text: string;
  subtitles: Array<SegmentSubtitleFrame>;
  dubs: { [key: string]: DubbedSegment };
};

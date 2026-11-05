import type { DubbingTargetTranscriptSegment } from "./DubbingTargetTranscriptSegment.js";
export type DubbingTargetTranscriptResponse = {
  /**
   * BCP-47 language tag of the source transcript.
   */
  source_language?: string | null;
  /**
   * BCP-47 language tag this target is translated into.
   */
  target_language: string;
  /**
   * The target segments, in playback order.
   */
  segments: Array<DubbingTargetTranscriptSegment>;
  /**
   * The target's revision at read time.
   */
  revision: number;
};

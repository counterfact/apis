import type { DubbingTranscriptSegment } from "./DubbingTranscriptSegment.js";
export type DubbingSourceTranscriptResponse = {
  /**
   * BCP-47 language tag of the source transcript (null if unknown).
   */
  language?: string | null;
  /**
   * The source segments, in playback order.
   */
  segments: Array<DubbingTranscriptSegment>;
  /**
   * The project's source-transcript revision at read time.
   */
  revision: number;
};

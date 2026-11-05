import type { DubbingTranscriptSegment } from "./DubbingTranscriptSegment.js";
/**
 * The result of a source-segment add or edit: the segment and the new revision.
 */
export type DubbingSourceSegmentUpdateResponse = {
  /**
   * The segment in its updated state.
   */
  segment: DubbingTranscriptSegment;
  /**
   * The project's source-transcript revision after this edit.
   */
  revision: number;
};

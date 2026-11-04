import type { DubbingTranscriptSegment } from "./DubbingTranscriptSegment.js";
/**
 * The result of a bulk source edit: the updated segments and the new revision.
 */
export type DubbingBulkSourceSegmentUpdateResponse = {
  /**
   * The edited segments in their updated state.
   */
  segments: Array<DubbingTranscriptSegment>;
  /**
   * The project's source-transcript revision after the edits.
   */
  revision: number;
};

import type { DubbingTargetTranscriptSegment } from "./DubbingTargetTranscriptSegment.js";
/**
 * The result of a bulk target edit: the updated segments and the new revision.
 */
export type DubbingBulkTargetSegmentUpdateResponse = {
  /**
   * The edited target segments in their updated state.
   */
  segments: Array<DubbingTargetTranscriptSegment>;
  /**
   * The target's revision after the edits.
   */
  revision: number;
};

import type { DubbingTargetTranscriptSegment } from "./DubbingTargetTranscriptSegment.js";
/**
 * The result of a target-translation edit: the updated segment and the new revision.
 */
export type DubbingTargetSegmentUpdateResponse = {
  /**
   * The target segment in its updated state.
   */
  segment: DubbingTargetTranscriptSegment;
  /**
   * The target's revision after this edit.
   */
  revision: number;
};

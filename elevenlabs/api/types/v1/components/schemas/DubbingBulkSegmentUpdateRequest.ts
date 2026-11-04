import type { DubbingSegmentUpdateRequest } from "./DubbingSegmentUpdateRequest.js";
/**
 * Edit several source segments at once, applied atomically (all succeed or none do).
 */
export type DubbingBulkSegmentUpdateRequest = {
  /**
   * Map of segment ID to the partial update to apply to that segment. At least one entry and at most 500.
   */
  segments: { [key: string]: DubbingSegmentUpdateRequest };
};

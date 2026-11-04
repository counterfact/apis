import type { DubbingTargetSegmentUpdateRequest } from "./DubbingTargetSegmentUpdateRequest.js";
/**
 * Edit several target translations at once, applied atomically (all succeed or none do).
 */
export type DubbingBulkTargetSegmentUpdateRequest = {
  /**
   * Map of segment ID to the translation edit to apply to that segment. At least one entry and at most 500.
   */
  segments: { [key: string]: DubbingTargetSegmentUpdateRequest };
};

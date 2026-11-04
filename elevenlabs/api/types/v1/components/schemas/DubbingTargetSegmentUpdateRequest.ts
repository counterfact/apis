/**
 * A partial edit to a target segment. An omitted field is left unchanged; a provided `null`
 * clears it (see each field for what clearing means).
 */
export type DubbingTargetSegmentUpdateRequest = {
  /**
   * New translated text, or null to mark the segment for re-translation.
   */
  translation?: string | null;
};

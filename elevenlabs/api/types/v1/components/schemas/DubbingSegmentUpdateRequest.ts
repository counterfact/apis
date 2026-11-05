/**
 * A partial update to a source segment; omitted fields are left unchanged.
 */
export type DubbingSegmentUpdateRequest = {
  /**
   * New text for the segment.
   */
  text?: string | null;
  /**
   * New speaker ID for the segment.
   */
  speaker_id?: string | null;
  /**
   * New start time, in seconds.
   */
  start_s?: number | null;
  /**
   * New end time, in seconds.
   */
  end_s?: number | null;
};

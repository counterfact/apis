/**
 * A new source segment; its ID and word-level alignment are assigned by the server.
 */
export type DubbingSegmentCreateRequest = {
  /**
   * The text of the new segment.
   */
  text: string;
  /**
   * Identifier of the segment's speaker.
   */
  speaker_id: string;
  /**
   * Start time of the segment, in seconds.
   */
  start_s: number;
  /**
   * End time of the segment, in seconds.
   */
  end_s: number;
};

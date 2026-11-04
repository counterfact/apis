/**
 * One segment of a source transcript.
 */
export type DubbingTranscriptSegment = {
  /**
   * Stable identifier of the segment, used to address it in edit requests.
   */
  id: string;
  /**
   * The transcribed text of the segment.
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
  /**
   * The caller-supplied external ID for this segment, if one was provided.
   */
  external_id?: string | null;
};

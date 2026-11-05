/**
 * One segment of a target transcript: a source segment plus its translation.
 */
export type DubbingTargetTranscriptSegment = {
  /**
   * Stable identifier of the segment (from the source).
   */
  id: string;
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
   * The source-language text of the segment.
   */
  source_text: string;
  /**
   * The translated text, or null if not translated yet (needs translation).
   */
  translation?: string | null;
};

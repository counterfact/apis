/**
 * @example {"max_chars_per_line":42,"max_duration_ms":7000,"max_lines_per_cue":2,"min_duration_ms":1000}
 */
export type CueOptionsRequest = {
  /**
   * Minimum duration of each cue in milliseconds.
   * @default 1000
   */
  min_duration_ms?: number;
  /**
   * Maximum duration of each cue in milliseconds.
   * @default 7000
   */
  max_duration_ms?: number;
  /**
   * Maximum number of lines per cue.
   * @default 2
   */
  max_lines_per_cue?: number;
  /**
   * Maximum number of characters per line in a cue.
   * @default 42
   */
  max_chars_per_line?: number;
  /**
   * Maximum characters per second reading speed. If not set, no reading speed limit is applied.
   */
  max_chars_per_s?: number | null;
  /**
   * Minimum gap between consecutive cues in frames. If not set, no minimum gap is enforced.
   */
  min_gap_between_cues_frames?: number | null;
};

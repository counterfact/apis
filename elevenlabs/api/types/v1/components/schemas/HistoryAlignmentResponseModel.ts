export type HistoryAlignmentResponseModel = {
  /**
   * The characters in the alignment.
   */
  characters: Array<string>;
  /**
   * The start times of the characters in seconds.
   */
  character_start_times_seconds: Array<number>;
  /**
   * The end times of the characters in seconds.
   */
  character_end_times_seconds: Array<number>;
};

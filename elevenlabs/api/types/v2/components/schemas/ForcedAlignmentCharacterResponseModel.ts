/**
 * Model representing a single character with its timing information from the aligner.
 * @example {"end":0.02,"start":0,"text":"H"}
 */
export type ForcedAlignmentCharacterResponseModel = {
  /**
   * The character that was transcribed.
   */
  text: string;
  /**
   * The start time of the character in seconds.
   */
  start: number;
  /**
   * The end time of the character in seconds.
   */
  end: number;
};

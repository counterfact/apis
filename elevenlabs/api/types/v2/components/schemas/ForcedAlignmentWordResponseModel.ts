/**
 * Model representing a single word with its timing information from the aligner.
 * @example {"end":1.02,"loss":0.12,"start":0,"text":"Hello"}
 */
export type ForcedAlignmentWordResponseModel = {
  /**
   * The word that was transcribed.
   */
  text: string;
  /**
   * The start time of the word in seconds.
   */
  start: number;
  /**
   * The end time of the word in seconds.
   */
  end: number;
  /**
   * The average alignment loss/confidence score for this word, calculated from its constituent characters.
   */
  loss: number;
};

/**
 * @example {"end":0.1,"start":0,"text":"H"}
 */
export type SpeechToTextCharacterResponseModel = {
  /**
   * The character that was transcribed.
   */
  text: string;
  /**
   * The start time of the character in seconds.
   */
  start?: number | null;
  /**
   * The end time of the character in seconds.
   */
  end?: number | null;
};

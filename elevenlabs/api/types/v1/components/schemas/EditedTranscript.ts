/**
 * A transcript produced by the optional transcript edit (text only, untimed).
 */
export type EditedTranscript = {
  /**
   * @default "transcript"
   */
  kind: "transcript";
  /**
   * The edited transcript text.
   */
  text: string;
  /**
   * The edited transcript text. Same value as `text`; matches the `edited_text` field of the realtime `edited_transcript` event.
   */
  edited_text: string;
};

/**
 * An error returned in place of an edited transcript when the edit could not be produced.
 */
export type TranscriptEditError = {
  /**
   * @default "error"
   */
  kind: "error";
  /**
   * edit_failed: the edit could not be produced.
   */
  error_type: "edit_failed";
  /**
   * A short, user-facing explanation of the failure.
   */
  message: string;
};

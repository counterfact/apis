export type TurnCommentRequestModel = {
  /**
   * Zero-based index of the transcript turn this comment refers to.
   */
  turn_index: number;
  /**
   * What went wrong at this turn.
   */
  comment: string;
};

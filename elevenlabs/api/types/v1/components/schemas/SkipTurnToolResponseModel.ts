export type SkipTurnToolResponseModel = {
  /**
   * @default "skip_turn_success"
   */
  result_type?: "skip_turn_success";
  /**
   * @default "success"
   */
  status?: "success";
  reason?: string | null;
};

export type EndCallToolResultModel = {
  /**
   * @default "end_call_success"
   */
  result_type?: "end_call_success";
  /**
   * @default "success"
   */
  status?: "success";
  reason?: string | null;
  message?: string | null;
};

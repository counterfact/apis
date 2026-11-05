export type PlayDTMFResultErrorModel = {
  /**
   * @default "play_dtmf_error"
   */
  result_type?: "play_dtmf_error";
  /**
   * @default "error"
   */
  status?: "error";
  error: string;
  details?: string | null;
};

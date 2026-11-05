export type PlayDTMFResultSuccessModel = {
  /**
   * @default "play_dtmf_success"
   */
  result_type?: "play_dtmf_success";
  /**
   * @default "success"
   */
  status?: "success";
  dtmf_tones: string;
  reason?: string | null;
};

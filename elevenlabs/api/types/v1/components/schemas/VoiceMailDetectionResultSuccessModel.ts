export type VoiceMailDetectionResultSuccessModel = {
  /**
   * @default "voicemail_detection_success"
   */
  result_type?: "voicemail_detection_success";
  /**
   * @default "success"
   */
  status?: "success";
  voicemail_message?: string | null;
  reason?: string | null;
};

export type LanguageDetectionToolResultModel = {
  /**
   * @default "language_detection_success"
   */
  result_type?: "language_detection_success";
  /**
   * @default "success"
   */
  status?: "success";
  reason?: string | null;
  language?: string | null;
};

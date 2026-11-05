export type BatchFailureResponseModel = {
  /**
   * @default "failure"
   */
  status: "failure";
  error_code: number;
  error_status: string;
  error_message: string;
};

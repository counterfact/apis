export type TransferToNumberResultErrorModel = {
  /**
   * @default "transfer_to_number_error"
   */
  result_type?: "transfer_to_number_error";
  /**
   * @default "error"
   */
  status?: "error";
  error: string;
  details?: string | null;
};

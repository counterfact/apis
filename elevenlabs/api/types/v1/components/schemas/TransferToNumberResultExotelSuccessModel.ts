export type TransferToNumberResultExotelSuccessModel = {
  /**
   * @default "transfer_to_number_exotel_success"
   */
  result_type?: "transfer_to_number_exotel_success";
  /**
   * @default "success"
   */
  status?: "success";
  transfer_number: string;
  reason?: string | null;
  agent_message?: string | null;
  note?: string | null;
};

export type TransferToNumberResultSipSuccessModel = {
  /**
   * @default "transfer_to_number_sip_success"
   */
  result_type?: "transfer_to_number_sip_success";
  /**
   * @default "success"
   */
  status?: "success";
  transfer_number: string;
  reason?: string | null;
  note?: string | null;
};

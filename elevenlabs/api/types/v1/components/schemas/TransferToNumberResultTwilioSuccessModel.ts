export type TransferToNumberResultTwilioSuccessModel = {
  /**
   * @default "transfer_to_number_twilio_success"
   */
  result_type?: "transfer_to_number_twilio_success";
  /**
   * @default "success"
   */
  status?: "success";
  transfer_number: string;
  reason?: string | null;
  client_message?: string | null;
  agent_message: string;
  conference_name: string;
  post_dial_digits?: string | null;
  note?: string | null;
};

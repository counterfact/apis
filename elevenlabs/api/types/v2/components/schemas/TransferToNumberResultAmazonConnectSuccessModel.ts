export type TransferToNumberResultAmazonConnectSuccessModel = {
  /**
   * @default "transfer_to_number_amazon_connect_success"
   */
  result_type?: "transfer_to_number_amazon_connect_success";
  /**
   * @default "success"
   */
  status?: "success";
  /**
   * Why the agent escalated, as sent to Amazon Connect with the Escalate outcome.
   */
  reason?: string | null;
  /**
   * Message spoken to the caller before the session was handed back to Amazon Connect.
   */
  client_message?: string | null;
  /**
   * Set when the agent echoed an invalid option and the only configured one was used.
   */
  note?: string | null;
};

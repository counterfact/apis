export type TransferToAgentToolResultErrorModel = {
  /**
   * @default "transfer_to_agent_error"
   */
  result_type?: "transfer_to_agent_error";
  /**
   * @default "error"
   */
  status?: "error";
  from_agent: string;
  error: string;
};

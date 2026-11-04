import type { AgentTransfer_Output } from "./AgentTransfer-Output.js";
export type TransferToAgentToolConfig_Output = {
  /**
   * @default "transfer_to_agent"
   */
  system_tool_type?: "transfer_to_agent";
  transfers: Array<AgentTransfer_Output>;
};

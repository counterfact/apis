import type { AgentTransfer_Input } from "./AgentTransfer-Input.js";
export type TransferToAgentToolConfig_Input = {
  /**
   * @default "transfer_to_agent"
   */
  system_tool_type?: "transfer_to_agent";
  transfers: Array<AgentTransfer_Input>;
};

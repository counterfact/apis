import type { TransferBranchInfoConfigured } from "./TransferBranchInfoConfigured.js";
import type { TransferBranchInfoTrafficSplit } from "./TransferBranchInfoTrafficSplit.js";
import type { TransferBranchInfoDefaultingToMain } from "./TransferBranchInfoDefaultingToMain.js";
export type TransferToAgentToolResultSuccessModel_Input = {
  /**
   * @default "transfer_to_agent_success"
   */
  result_type?: "transfer_to_agent_success";
  /**
   * @default "success"
   */
  status?: "success";
  from_agent: string;
  to_agent: string;
  to_node?: string | null;
  condition: string;
  /**
   * @default 0
   */
  delay_ms?: number;
  transfer_message?: string | null;
  /**
   * @default false
   */
  enable_transferred_agent_first_message?: boolean;
  branch_info?:
    | (
        | (TransferBranchInfoConfigured & { branch_reason: "configured" })
        | (TransferBranchInfoTrafficSplit & { branch_reason: "traffic_split" })
        | (TransferBranchInfoDefaultingToMain & {
            branch_reason: "defaulting_to_main";
          })
      )
    | null;
  /**
   * @default false
   */
  preserve_client_tts_overrides?: boolean;
  /**
   * @default false
   */
  preserve_voice_settings?: boolean;
};

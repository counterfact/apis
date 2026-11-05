import type { PhoneNumberTransfer } from "./PhoneNumberTransfer.js";
export type TransferToNumberToolConfig_Output = {
  /**
   * @default "transfer_to_number"
   */
  system_tool_type?: "transfer_to_number";
  transfers: Array<PhoneNumberTransfer>;
  /**
   * Whether to play a message to the client while they wait for transfer. Defaults to true for backward compatibility.
   * @default true
   */
  enable_client_message?: boolean;
};

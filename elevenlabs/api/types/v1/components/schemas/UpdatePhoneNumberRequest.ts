import type { InboundSIPTrunkConfigRequestModel } from "./InboundSIPTrunkConfigRequestModel.js";
import type { OutboundSIPTrunkConfigRequestModel } from "./OutboundSIPTrunkConfigRequestModel.js";
import type { LivekitStackType } from "./LivekitStackType.js";
export type UpdatePhoneNumberRequest = {
  agent_id?: string | null;
  label?: string | null;
  inbound_trunk_config?: InboundSIPTrunkConfigRequestModel | null;
  outbound_trunk_config?: OutboundSIPTrunkConfigRequestModel | null;
  livekit_stack?: LivekitStackType | null;
  store_sip_messages?: boolean | null;
  /**
   * Environment to use for resolving environment variables on calls to this number.
   */
  environment?: string | null;
  /**
   * Agent branch to use for calls to this number.
   */
  branch_id?: string | null;
};

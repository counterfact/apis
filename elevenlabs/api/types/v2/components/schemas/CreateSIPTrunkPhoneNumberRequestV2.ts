import type { InboundSIPTrunkConfigRequestModel } from "./InboundSIPTrunkConfigRequestModel.js";
import type { OutboundSIPTrunkConfigRequestModel } from "./OutboundSIPTrunkConfigRequestModel.js";
export type CreateSIPTrunkPhoneNumberRequestV2 = {
  /**
   * Phone number
   */
  phone_number: string;
  /**
   * Label for the phone number
   */
  label: string;
  /**
   * This field is deprecated and will be removed in the future. Whether this phone number supports inbound calls
   * @default true
   * @deprecated
   */
  supports_inbound?: boolean;
  /**
   * This field is deprecated and will be removed in the future. Whether this phone number supports outbound calls
   * @default true
   * @deprecated
   */
  supports_outbound?: boolean;
  /**
   * @default "sip_trunk"
   */
  provider?: "sip_trunk";
  /**
   * Agent ID to assign the phone number to
   */
  agent_id?: string | null;
  inbound_trunk_config?: InboundSIPTrunkConfigRequestModel | null;
  outbound_trunk_config?: OutboundSIPTrunkConfigRequestModel | null;
};

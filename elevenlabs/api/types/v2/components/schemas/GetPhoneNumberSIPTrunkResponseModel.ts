import type { PhoneNumberAgentInfo } from "./PhoneNumberAgentInfo.js";
import type { GetPhoneNumberOutboundSIPTrunkConfigResponseModel } from "./GetPhoneNumberOutboundSIPTrunkConfigResponseModel.js";
import type { GetPhoneNumberInboundSIPTrunkConfigResponseModel } from "./GetPhoneNumberInboundSIPTrunkConfigResponseModel.js";
import type { LivekitStackType } from "./LivekitStackType.js";
/**
 * @example {"label":"Sales Team","livekit_stack":"standard","phone_number":"+1987654321","phone_number_id":"phone_456","provider":"sip_trunk"}
 */
export type GetPhoneNumberSIPTrunkResponseModel = {
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
   * The ID of the phone number
   */
  phone_number_id: string;
  /**
   * The agent that is assigned to the phone number
   */
  assigned_agent?: PhoneNumberAgentInfo | null;
  /**
   * Phone provider
   * @default "sip_trunk"
   */
  provider?: "sip_trunk";
  /**
   * @deprecated
   */
  provider_config?: GetPhoneNumberOutboundSIPTrunkConfigResponseModel | null;
  /**
   * Configuration of the Outbound SIP trunk - if configured.
   */
  outbound_trunk?: GetPhoneNumberOutboundSIPTrunkConfigResponseModel | null;
  /**
   * Configuration of the Inbound SIP trunk - if configured.
   */
  inbound_trunk?: GetPhoneNumberInboundSIPTrunkConfigResponseModel | null;
  /**
   * Type of Livekit stack used for this number.
   */
  livekit_stack: LivekitStackType;
  /**
   * Whether to store SIP messages for this phone number.
   * @default true
   */
  store_sip_messages?: boolean;
};

import type { PhoneNumberAgentInfo } from "./PhoneNumberAgentInfo.js";
/**
 * @example {"label":"Customer Support","phone_number":"+1234567890","phone_number_id":"phone_123","provider":"twilio"}
 */
export type GetPhoneNumberTwilioResponseModel = {
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
   * @default "twilio"
   */
  provider?: "twilio";
};

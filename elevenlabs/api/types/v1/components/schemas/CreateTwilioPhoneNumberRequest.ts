import type { RegionConfigRequest } from "./RegionConfigRequest.js";
export type CreateTwilioPhoneNumberRequest = {
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
   * @default "twilio"
   */
  provider?: "twilio";
  /**
   * Agent ID to assign the phone number to
   */
  agent_id?: string | null;
  /**
   * Twilio Account SID (starts with `AC`) or API Key SID (starts with `SK`)
   */
  sid: string;
  /**
   * Secret paired with `sid`: the Account Auth Token for an Account SID, or the API Key Secret for an API Key SID
   */
  token: string;
  /**
   * Twilio Account Auth Token, required for API Key imports to validate inbound webhook signatures
   */
  account_auth_token?: string | null;
  /**
   * Twilio Additional Region Configuration
   */
  region_config?: RegionConfigRequest | null;
  /**
   * Route inbound SMS to ElevenLabs. On by default; set to false to skip SMS configuration for numbers that don't support it.
   * @default true
   */
  enable_sms?: boolean;
};

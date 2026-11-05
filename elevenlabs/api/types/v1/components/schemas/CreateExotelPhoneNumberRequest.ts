import type { ExotelApiSubdomain } from "./ExotelApiSubdomain.js";
/**
 * @example {"account_sid":"your-account-sid","api_key":"your-api-key","api_subdomain":"api.in.exotel.com","api_token":"********","app_id":"12345","label":"Exotel Outbound","phone_number":"+919999999999","provider":"exotel"}
 */
export type CreateExotelPhoneNumberRequest = {
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
   * @default "exotel"
   */
  provider?: "exotel";
  /**
   * Agent ID to assign the phone number to
   */
  agent_id?: string | null;
  /**
   * Exotel Account SID
   */
  account_sid: string;
  /**
   * Exotel API Key
   */
  api_key: string;
  /**
   * Exotel API Token
   */
  api_token: string;
  /**
   * Exotel region-specific API host
   */
  api_subdomain: ExotelApiSubdomain;
  /**
   * Exotel applet identifier used in Calls/connect
   */
  app_id: string;
  /**
   * Optional full applet URL override. Defaults to Exotel start_voice URL derived from account SID and app ID.
   */
  applet_url?: string | null;
};

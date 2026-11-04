import type { SIPMediaEncryptionEnum } from "./SIPMediaEncryptionEnum.js";
export type GetPhoneNumberInboundSIPTrunkConfigResponseModel = {
  /**
   * List of IP addresses that are allowed to use the trunk. Each item in the list can be an individual IP address or a Classless Inter-Domain Routing notation representing a CIDR block.
   */
  allowed_addresses: Array<string>;
  /**
   * List of phone numbers that are allowed to use the trunk.
   */
  allowed_numbers: Array<string> | null;
  media_encryption: SIPMediaEncryptionEnum;
  /**
   * Whether authentication credentials are configured
   */
  has_auth_credentials: boolean;
  /**
   * SIP trunk username (if available)
   */
  username?: string | null;
  /**
   * Domains of remote SIP servers used to validate TLS certificates.
   */
  remote_domains?: Array<string> | null;
  /**
   * Map of dynamic variable name to header name for attributes_to_headers
   */
  attributes_to_headers?: { [key: string]: string };
};

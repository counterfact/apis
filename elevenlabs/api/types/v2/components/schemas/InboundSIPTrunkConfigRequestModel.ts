import type { SIPMediaEncryptionEnum } from "./SIPMediaEncryptionEnum.js";
import type { SIPTrunkCredentialsRequestModel } from "./SIPTrunkCredentialsRequestModel.js";
export type InboundSIPTrunkConfigRequestModel = {
  /**
   * List of IP addresses that are allowed to use the trunk. Each item in the list can be an individual IP address or a Classless Inter-Domain Routing notation representing a CIDR block.
   */
  allowed_addresses?: Array<string> | null;
  /**
   * List of phone numbers that are allowed to use the trunk.
   */
  allowed_numbers?: Array<string> | null;
  /**
   * Whether or not to encrypt media (data layer).
   * @default "allowed"
   */
  media_encryption?: SIPMediaEncryptionEnum;
  /**
   * Optional digest authentication credentials (username/password).
   */
  credentials?: SIPTrunkCredentialsRequestModel | null;
  /**
   * Domains of remote SIP servers used to validate TLS certificates.
   */
  remote_domains?: Array<string> | null;
  /**
   * Map of dynamic variable name to header name for attributes_to_headers
   */
  attributes_to_headers?: { [key: string]: string };
};

import type { SIPTrunkTransportEnum } from "./SIPTrunkTransportEnum.js";
import type { SIPMediaEncryptionEnum } from "./SIPMediaEncryptionEnum.js";
import type { SIPTrunkCredentialsRequestModel } from "./SIPTrunkCredentialsRequestModel.js";
import type { MediaCodec } from "./MediaCodec.js";
export type OutboundSIPTrunkConfigRequestModel = {
  /**
   * Hostname or IP the SIP INVITE is sent to.
   */
  address: string;
  /**
   * Protocol to use for SIP transport (signalling layer).
   * @default "auto"
   */
  transport?: SIPTrunkTransportEnum;
  /**
   * Whether or not to encrypt media (data layer).
   * @default "allowed"
   */
  media_encryption?: SIPMediaEncryptionEnum;
  /**
   * SIP X-* headers for INVITE request. These headers are sent as-is and may help identify this call.
   */
  headers?: { [key: string]: string };
  /**
   * Map of dynamic variable name to header name for attributes_to_headers
   */
  attributes_to_headers?: { [key: string]: string };
  /**
   * Optional digest authentication credentials (username/password). If not provided, ACL authentication is assumed.
   */
  credentials?: SIPTrunkCredentialsRequestModel | null;
  /**
   * Media codecs that should be offered in the SDP for outbound calls. If empty, all supported codecs are offered.
   */
  enabled_codecs?: Array<MediaCodec>;
};

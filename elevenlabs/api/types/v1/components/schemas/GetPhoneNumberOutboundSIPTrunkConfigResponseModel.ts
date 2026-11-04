import type { SIPTrunkTransportEnum } from "./SIPTrunkTransportEnum.js";
import type { SIPMediaEncryptionEnum } from "./SIPMediaEncryptionEnum.js";
import type { MediaCodec } from "./MediaCodec.js";
/**
 * SIP Trunk configuration details for a phone number
 */
export type GetPhoneNumberOutboundSIPTrunkConfigResponseModel = {
  /**
   * Hostname or IP the SIP INVITE is sent to
   */
  address: string;
  /**
   * Protocol to use for SIP transport
   */
  transport: SIPTrunkTransportEnum;
  /**
   * Whether or not to encrypt media (data layer).
   */
  media_encryption: SIPMediaEncryptionEnum;
  /**
   * SIP headers for INVITE request
   */
  headers?: { [key: string]: string };
  /**
   * Map of dynamic variable name to header name for attributes_to_headers
   */
  attributes_to_headers?: { [key: string]: string };
  /**
   * Whether authentication credentials are configured
   */
  has_auth_credentials: boolean;
  /**
   * SIP trunk username (if available)
   */
  username?: string | null;
  /**
   * Whether a LiveKit SIP outbound trunk is configured
   * @default false
   */
  has_outbound_trunk?: boolean;
  /**
   * Media codecs that are offered in the SDP for outbound calls. If empty, all supported codecs are offered.
   */
  enabled_codecs?: Array<MediaCodec>;
};

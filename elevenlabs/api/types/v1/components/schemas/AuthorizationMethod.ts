/**
 * @default "public"
 */
export type AuthorizationMethod =
  | "invalid"
  | "public"
  | "authorization_header"
  | "signed_url"
  | "shareable_link"
  | "livekit_token"
  | "livekit_token_website"
  | "genesys_api_key"
  | "avaya_api_key"
  | "audiocodes_api_key"
  | "whatsapp"
  | "sms";

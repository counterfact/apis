import type { OAuth2ClientCredsResponse } from "./OAuth2ClientCredsResponse.js";
import type { RefreshTokenAuthResponse } from "./RefreshTokenAuthResponse.js";
import type { BasicAuthResponse } from "./BasicAuthResponse.js";
import type { BearerAuthResponse } from "./BearerAuthResponse.js";
import type { OAuth2JWTResponse } from "./OAuth2JWTResponse.js";
import type { PrivateKeyJWTResponse } from "./PrivateKeyJWTResponse.js";
import type { MTLSAuthResponse } from "./MTLSAuthResponse.js";
import type { CustomHeaderAuthResponse } from "./CustomHeaderAuthResponse.js";
import type { ApiIntegrationOAuth2AuthCodeResponse } from "./ApiIntegrationOAuth2AuthCodeResponse.js";
import type { ApiIntegrationOAuth2CustomAppResponse } from "./ApiIntegrationOAuth2CustomAppResponse.js";
import type { WhatsAppAuthResponse } from "./WhatsAppAuthResponse.js";
import type { SlackBotAuthResponse } from "./SlackBotAuthResponse.js";
import type { UrlSecretAuthResponse } from "./UrlSecretAuthResponse.js";
export type ListAuthConnectionsResponse = {
  auth_connections: Array<
    | (OAuth2ClientCredsResponse & { auth_type: "oauth2_client_credentials" })
    | (RefreshTokenAuthResponse & { auth_type: "refresh_token_auth" })
    | (BasicAuthResponse & { auth_type: "basic_auth" })
    | (BearerAuthResponse & { auth_type: "bearer_auth" })
    | (OAuth2JWTResponse & { auth_type: "oauth2_jwt" })
    | (PrivateKeyJWTResponse & { auth_type: "private_key_jwt" })
    | (MTLSAuthResponse & { auth_type: "mtls" })
    | (CustomHeaderAuthResponse & { auth_type: "custom_header_auth" })
    | (ApiIntegrationOAuth2AuthCodeResponse & {
        auth_type: "api_integration_oauth2_auth_code";
      })
    | (ApiIntegrationOAuth2CustomAppResponse & {
        auth_type: "api_integration_oauth2_custom_app";
      })
    | (WhatsAppAuthResponse & { auth_type: "whatsapp_auth" })
    | (SlackBotAuthResponse & { auth_type: "slack_bot_auth" })
    | (UrlSecretAuthResponse & { auth_type: "url_secret" })
  >;
};

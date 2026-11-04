import type { AuthConnectionDependencies } from "./AuthConnectionDependencies.js";
import type { AuthConnectionStatus } from "./AuthConnectionStatus.js";
/**
 * Response model for user-owned OAuth2 Custom App auth connections
 */
export type ApiIntegrationOAuth2CustomAppResponse = {
  name: string;
  /**
   * @default "api_integration_oauth2_custom_app"
   */
  auth_type?: "api_integration_oauth2_custom_app";
  provider: string;
  token_url: string;
  scopes?: Array<string>;
  /**
   * Separator for scopes
   * @default " "
   */
  scope_separator?: " " | ",";
  /**
   * ISO 8601 timestamp of when the access token expires
   */
  expires_at: string;
  integration_id: string;
  credential_id: string;
  /**
   * OAuth client ID (rendered from template if credential uses templated credentials, None for legacy connections)
   */
  client_id: string;
  id: string;
  used_by?: AuthConnectionDependencies | null;
  /**
   * @default "active"
   */
  status?: AuthConnectionStatus;
  status_detail?: string | null;
  status_updated_at?: string | null;
};

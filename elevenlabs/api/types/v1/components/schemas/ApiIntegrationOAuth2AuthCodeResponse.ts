import type { AuthConnectionDependencies } from "./AuthConnectionDependencies.js";
import type { AuthConnectionStatus } from "./AuthConnectionStatus.js";
/**
 * Response model for integration-managed OAuth2 Auth Code auth connections
 */
export type ApiIntegrationOAuth2AuthCodeResponse = {
  name: string;
  /**
   * @default "api_integration_oauth2_auth_code"
   */
  auth_type?: "api_integration_oauth2_auth_code";
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
  id: string;
  used_by?: AuthConnectionDependencies | null;
  /**
   * @default "active"
   */
  status?: AuthConnectionStatus;
  status_detail?: string | null;
  status_updated_at?: string | null;
};

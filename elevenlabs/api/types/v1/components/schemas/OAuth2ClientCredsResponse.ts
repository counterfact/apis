import type { AuthConnectionDependencies } from "./AuthConnectionDependencies.js";
import type { AuthConnectionStatus } from "./AuthConnectionStatus.js";
/**
 * Response model for oauth2 client creds
 */
export type OAuth2ClientCredsResponse = {
  name: string;
  /**
   * @default "oauth2_client_credentials"
   */
  auth_type?: "oauth2_client_credentials";
  provider: string;
  client_id: string;
  token_url: string;
  /**
   * @default []
   */
  scopes?: Array<string>;
  /**
   * @default {}
   */
  extra_params?: { [key: string]: string };
  /**
   * If True, send client credentials in Authorization header as Basic Auth instead of request body
   * @default false
   */
  basic_auth_in_header?: boolean;
  id: string;
  used_by?: AuthConnectionDependencies | null;
  /**
   * @default "active"
   */
  status?: AuthConnectionStatus;
  status_detail?: string | null;
  status_updated_at?: string | null;
  /**
   * Custom headers configured for OAuth2 token requests
   */
  custom_headers?: { [key: string]: string };
};

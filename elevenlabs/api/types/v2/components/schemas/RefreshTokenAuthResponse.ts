import type { AuthConnectionDependencies } from "./AuthConnectionDependencies.js";
import type { AuthConnectionStatus } from "./AuthConnectionStatus.js";
/**
 * Response model for OAuth2 refresh-token-grant auth connections
 */
export type RefreshTokenAuthResponse = {
  name: string;
  /**
   * @default "refresh_token_auth"
   */
  auth_type?: "refresh_token_auth";
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
  id: string;
  used_by?: AuthConnectionDependencies | null;
  /**
   * @default "active"
   */
  status?: AuthConnectionStatus;
  status_detail?: string | null;
  status_updated_at?: string | null;
};

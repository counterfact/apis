import type { AuthConnectionDependencies } from "./AuthConnectionDependencies.js";
import type { AuthConnectionStatus } from "./AuthConnectionStatus.js";
/**
 * Response model for Custom Header Auth auth connections
 */
export type CustomHeaderAuthResponse = {
  name: string;
  /**
   * @default "custom_header_auth"
   */
  auth_type?: "custom_header_auth";
  provider: string;
  /**
   * The name of the header to use for authentication (e.g., 'x-api-key')
   */
  header_name: string;
  id: string;
  used_by?: AuthConnectionDependencies | null;
  /**
   * @default "active"
   */
  status?: AuthConnectionStatus;
  status_detail?: string | null;
  status_updated_at?: string | null;
};

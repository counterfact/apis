import type { AuthConnectionDependencies } from "./AuthConnectionDependencies.js";
import type { AuthConnectionStatus } from "./AuthConnectionStatus.js";
/**
 * Response model for basic auth
 */
export type BasicAuthResponse = {
  name: string;
  /**
   * @default "basic_auth"
   */
  auth_type?: "basic_auth";
  provider: string;
  username: string;
  id: string;
  used_by?: AuthConnectionDependencies | null;
  /**
   * @default "active"
   */
  status?: AuthConnectionStatus;
  status_detail?: string | null;
  status_updated_at?: string | null;
};

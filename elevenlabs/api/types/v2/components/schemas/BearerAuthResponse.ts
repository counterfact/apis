import type { AuthConnectionDependencies } from "./AuthConnectionDependencies.js";
import type { AuthConnectionStatus } from "./AuthConnectionStatus.js";
/**
 * Response model for bearer auth
 */
export type BearerAuthResponse = {
  name: string;
  /**
   * @default "bearer_auth"
   */
  auth_type?: "bearer_auth";
  provider: string;
  id: string;
  used_by?: AuthConnectionDependencies | null;
  /**
   * @default "active"
   */
  status?: AuthConnectionStatus;
  status_detail?: string | null;
  status_updated_at?: string | null;
};

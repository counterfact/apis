import type { AuthConnectionDependencies } from "./AuthConnectionDependencies.js";
import type { AuthConnectionStatus } from "./AuthConnectionStatus.js";
/**
 * Response model for mTLS auth connections.
 */
export type MTLSAuthResponse = {
  name: string;
  /**
   * @default "mtls"
   */
  auth_type?: "mtls";
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

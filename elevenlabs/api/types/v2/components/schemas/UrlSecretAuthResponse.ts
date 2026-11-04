import type { AuthConnectionDependencies } from "./AuthConnectionDependencies.js";
import type { AuthConnectionStatus } from "./AuthConnectionStatus.js";
export type UrlSecretAuthResponse = {
  name: string;
  /**
   * @default "url_secret"
   */
  auth_type?: "url_secret";
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

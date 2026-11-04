import type { AuthConnectionDependencies } from "./AuthConnectionDependencies.js";
import type { AuthConnectionStatus } from "./AuthConnectionStatus.js";
export type WhatsAppAuthResponse = {
  name: string;
  /**
   * @default "whatsapp_auth"
   */
  auth_type?: "whatsapp_auth";
  /**
   * @default "whatsapp"
   */
  provider?: "whatsapp";
  phone_number_id: string;
  id: string;
  used_by?: AuthConnectionDependencies | null;
  /**
   * @default "active"
   */
  status?: AuthConnectionStatus;
  status_detail?: string | null;
  status_updated_at?: string | null;
};

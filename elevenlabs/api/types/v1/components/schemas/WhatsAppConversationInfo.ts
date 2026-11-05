import type { WhatsAppRecipient } from "./WhatsAppRecipient.js";
import type { WhatsAppCallPermissionRequest } from "./WhatsAppCallPermissionRequest.js";
import type { CallResult } from "./CallResult.js";
import type { WhatsAppOpeningMessage } from "./WhatsAppOpeningMessage.js";
export type WhatsAppConversationInfo = {
  /**
   * @default "unknown"
   */
  direction?: "inbound" | "outbound" | "unknown";
  whatsapp_phone_number_id?: string | null;
  whatsapp_user_id: string;
  awaiting_first_user_message?: boolean | null;
  recipient?: WhatsAppRecipient | null;
  call_permission_request?: WhatsAppCallPermissionRequest | null;
  call_result?: CallResult | null;
  opening_message?: WhatsAppOpeningMessage | null;
};

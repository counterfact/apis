import type { ConversationInitiationClientDataRequest_Input } from "./ConversationInitiationClientDataRequest-Input.js";
export type OutboundCallRecipient = {
  id?: string | null;
  phone_number?: string | null;
  whatsapp_user_id?: string | null;
  conversation_initiation_client_data?: ConversationInitiationClientDataRequest_Input | null;
};

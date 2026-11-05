import type { BatchCallRecipientStatus } from "./BatchCallRecipientStatus.js";
import type { ConversationInitiationClientDataInternal } from "./ConversationInitiationClientDataInternal.js";
export type OutboundCallRecipientResponseModel = {
  id: string;
  phone_number?: string | null;
  whatsapp_user_id?: string | null;
  status: BatchCallRecipientStatus;
  created_at_unix: number;
  updated_at_unix: number;
  conversation_id: string | null;
  conversation_initiation_client_data?: ConversationInitiationClientDataInternal | null;
};

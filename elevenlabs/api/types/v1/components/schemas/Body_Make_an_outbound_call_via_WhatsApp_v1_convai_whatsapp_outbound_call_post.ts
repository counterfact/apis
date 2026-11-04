import type { ConversationInitiationClientDataRequest_Input } from "./ConversationInitiationClientDataRequest-Input.js";
export type Body_Make_an_outbound_call_via_WhatsApp_v1_convai_whatsapp_outbound_call_post =
  {
    whatsapp_phone_number_id: string;
    whatsapp_user_id: string;
    whatsapp_call_permission_request_template_name: string;
    whatsapp_call_permission_request_template_language_code: string;
    agent_id: string;
    conversation_initiation_client_data?: ConversationInitiationClientDataRequest_Input | null;
  };

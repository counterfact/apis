import type { WhatsAppTemplateHeaderComponentParams } from "./WhatsAppTemplateHeaderComponentParams.js";
import type { WhatsAppTemplateBodyComponentParams } from "./WhatsAppTemplateBodyComponentParams.js";
import type { WhatsAppTemplateButtonComponentParams } from "./WhatsAppTemplateButtonComponentParams.js";
import type { ConversationInitiationClientDataRequest_Input } from "./ConversationInitiationClientDataRequest-Input.js";
export type Body_Send_an_outbound_message_via_WhatsApp_v1_convai_whatsapp_outbound_message_post =
  {
    whatsapp_phone_number_id: string;
    whatsapp_user_id: string;
    template_name: string;
    template_language_code: string;
    template_params: Array<
      | (WhatsAppTemplateHeaderComponentParams & { type: "header" })
      | (WhatsAppTemplateBodyComponentParams & { type: "body" })
      | (WhatsAppTemplateButtonComponentParams & { type: "button" })
    >;
    agent_id: string;
    conversation_initiation_client_data?: ConversationInitiationClientDataRequest_Input | null;
  };

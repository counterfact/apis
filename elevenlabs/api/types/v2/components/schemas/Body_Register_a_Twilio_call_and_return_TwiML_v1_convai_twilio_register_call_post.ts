import type { TelephonyDirection } from "./TelephonyDirection.js";
import type { ConversationInitiationClientDataRequest_Input } from "./ConversationInitiationClientDataRequest-Input.js";
export type Body_Register_a_Twilio_call_and_return_TwiML_v1_convai_twilio_register_call_post =
  {
    agent_id: string;
    from_number: string;
    to_number: string;
    /**
     * @default "inbound"
     */
    direction?: TelephonyDirection;
    conversation_initiation_client_data?: ConversationInitiationClientDataRequest_Input | null;
  };

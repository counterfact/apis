import type { ConversationInitiationClientDataRequest_Input } from "./ConversationInitiationClientDataRequest-Input.js";
import type { TelephonyCallConfig_Input } from "./TelephonyCallConfig-Input.js";
export type Body_Handle_an_outbound_call_via_Exotel_v1_convai_exotel_outbound_call_post =
  {
    agent_id: string;
    agent_phone_number_id: string;
    to_number: string;
    conversation_initiation_client_data?: ConversationInitiationClientDataRequest_Input | null;
    /**
     * @default {"ringing_timeout_secs":60,"twilio_call_recording_enabled":false}
     */
    telephony_call_config?: TelephonyCallConfig_Input;
  };

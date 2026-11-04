import type { OutboundCallRecipient } from "./OutboundCallRecipient.js";
import type { BatchCallWhatsAppParams } from "./BatchCallWhatsAppParams.js";
import type { TelephonyCallConfig_Input } from "./TelephonyCallConfig-Input.js";
export type Body_Submit_a_batch_call_request__v1_convai_batch_calling_submit_post =
  {
    call_name: string;
    agent_id: string;
    recipients: Array<OutboundCallRecipient>;
    scheduled_time_unix?: number | null;
    agent_phone_number_id?: string | null;
    whatsapp_params?: BatchCallWhatsAppParams | null;
    timezone?: string | null;
    branch_id?: string | null;
    environment?: string | null;
    /**
     * @default {"ringing_timeout_secs":60,"twilio_call_recording_enabled":false}
     */
    telephony_call_config?: TelephonyCallConfig_Input;
    /**
     * Maximum number of simultaneous calls for this batch. When set, dispatch is governed by this limit rather than workspace/agent capacity percentages.
     */
    target_concurrency_limit?: number | null;
  };

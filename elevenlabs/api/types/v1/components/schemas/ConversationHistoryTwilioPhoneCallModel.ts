import type { TelephonyDirection } from "./TelephonyDirection.js";
import type { CallResult } from "./CallResult.js";
export type ConversationHistoryTwilioPhoneCallModel = {
  direction: TelephonyDirection;
  phone_number_id: string;
  agent_number: string;
  external_number: string;
  call_result?: CallResult | null;
  type: "twilio";
  stream_sid: string;
  call_sid: string;
};

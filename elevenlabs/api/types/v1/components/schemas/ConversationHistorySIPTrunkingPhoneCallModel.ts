import type { TelephonyDirection } from "./TelephonyDirection.js";
import type { CallResult } from "./CallResult.js";
export type ConversationHistorySIPTrunkingPhoneCallModel = {
  direction: TelephonyDirection;
  phone_number_id: string;
  agent_number: string;
  external_number: string;
  call_result?: CallResult | null;
  type: "sip_trunking";
  call_id?: string | null;
  call_sid: string;
  sip_header_dynamic_variables?: { [key: string]: string };
};

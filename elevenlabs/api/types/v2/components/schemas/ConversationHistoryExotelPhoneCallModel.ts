import type { TelephonyDirection } from "./TelephonyDirection.js";
import type { CallResult } from "./CallResult.js";
export type ConversationHistoryExotelPhoneCallModel = {
  direction: TelephonyDirection;
  phone_number_id: string;
  agent_number: string;
  external_number: string;
  call_result?: CallResult | null;
  /**
   * @default "exotel"
   */
  type?: "exotel";
  stream_sid: string;
  call_sid: string;
};

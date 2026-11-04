import type { SIPLogMessageDirection } from "./SIPLogMessageDirection.js";
export type SIPLogMessage = {
  call_id: string;
  phone_numbers: Array<string>;
  local_address: string;
  remote_address: string;
  transport: string;
  raw_message: string;
  error_message: string;
  direction: SIPLogMessageDirection;
  created_at_unix_micro: number;
};

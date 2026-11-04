/**
 * Carrier-level AMD verdict reported by Twilio via `AnsweredBy`.
 */
export type TwilioAnsweredBy =
  | "human"
  | "fax"
  | "unknown"
  | "machine_start"
  | "machine_end_beep"
  | "machine_end_silence"
  | "machine_end_other";

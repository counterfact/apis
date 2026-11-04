/**
 * Configuration for DTMF (keypad) input collection during phone calls.
 */
export type DTMFInputConfig = {
  /**
   * Timeout in seconds to wait for additional DTMF digits
   * @default 2
   */
  dtmf_input_timeout?: number;
  /**
   * If true, pressing # immediately completes DTMF input
   * @default true
   */
  hash_terminator?: boolean;
  /**
   * If true, replace the caller's DTMF (keypad) entries with a redaction marker in the transcript, conversation log and analysis. Digits the agent repeats back or passes to a tool are not affected.
   * @default false
   */
  redact_input?: boolean;
};

/**
 * @example {"message":"Hhmmmm...yeah."}
 */
export type SoftTimeoutConfigOverride = {
  /**
   * Message to show when the first soft timeout is reached while waiting for LLM response. Supports dynamic variables (e.g., {{system__time}}, {{custom_variable}}).
   */
  message?: string | null;
  /**
   * Extra static filler messages for subsequent soft timeouts in the same LLM generation. The first timeout uses `message`. If fewer messages are configured than `max_soft_timeouts_per_generation`, the last configured message is repeated; otherwise a built-in filler is used.
   */
  additional_soft_timeout_messages?: Array<string> | null;
};

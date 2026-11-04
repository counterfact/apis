/**
 * @example {"message":"Hhmmmm...yeah.","timeout_seconds":-1,"use_llm_generated_message":false}
 */
export type SoftTimeoutConfigWorkflowOverride = {
  /**
   * Time in seconds before showing the predefined message while waiting for LLM response. Set to -1 to disable.
   */
  timeout_seconds?: number | null;
  /**
   * Message to show when the first soft timeout is reached while waiting for LLM response. Supports dynamic variables (e.g., {{system__time}}, {{custom_variable}}).
   */
  message?: string | null;
  /**
   * Extra static filler messages for subsequent soft timeouts in the same LLM generation. The first timeout uses `message`. If fewer messages are configured than `max_soft_timeouts_per_generation`, the last configured message is repeated; otherwise a built-in filler is used.
   */
  additional_soft_timeout_messages?: Array<string> | null;
  /**
   * If enabled, the soft timeout message will be generated dynamically instead of using the static message.
   */
  use_llm_generated_message?: boolean | null;
  /**
   * If enabled, shuffle the order of static soft timeout messages once at the start of each turn. Only applies when use_llm_generated_message is false.
   */
  randomize_fillers?: boolean | null;
  /**
   * Maximum filler messages while waiting for a single LLM response. Fires every timeout_seconds until the LLM streams content or this limit is reached.
   */
  max_soft_timeouts_per_generation?: number | null;
  /**
   * Custom prompt for generating the soft timeout filler message when use_llm_generated_message is enabled. Recent conversation context is provided as a separate user message. If not set, the default prompt will be used. Supports dynamic variables (e.g., {{system__time}}, {{custom_variable}}).
   */
  llm_generated_message_prompt_override?: string | null;
  /**
   * When true, soft timeout fillers are suppressed until the conversation has at least one real user message. Prevents fillers during the agent's opening turn (e.g. workflow generate-immediately / tool calls before the user speaks).
   */
  disable_until_first_user_message?: boolean | null;
};

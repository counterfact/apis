/**
 * Configuration for soft timeout functionality during LLM response generation.
 * @example {"message":"Hhmmmm...yeah.","timeout_seconds":2,"use_llm_generated_message":false}
 */
export type SoftTimeoutConfig = {
  /**
   * Time in seconds before showing the predefined message while waiting for LLM response. Set to -1 to disable.
   * @default -1
   */
  timeout_seconds?: number;
  /**
   * Message to show when the first soft timeout is reached while waiting for LLM response. Supports dynamic variables (e.g., {{system__time}}, {{custom_variable}}).
   * @default "Hhmmmm...yeah."
   */
  message?: string;
  /**
   * Extra static filler messages for subsequent soft timeouts in the same LLM generation. The first timeout uses `message`. If fewer messages are configured than `max_soft_timeouts_per_generation`, the last configured message is repeated; otherwise a built-in filler is used.
   */
  additional_soft_timeout_messages?: Array<string>;
  /**
   * If enabled, the soft timeout message will be generated dynamically instead of using the static message.
   * @default false
   */
  use_llm_generated_message?: boolean;
  /**
   * If enabled, shuffle the order of static soft timeout messages once at the start of each turn. Only applies when use_llm_generated_message is false.
   * @default false
   */
  randomize_fillers?: boolean;
  /**
   * Maximum filler messages while waiting for a single LLM response. Fires every timeout_seconds until the LLM streams content or this limit is reached.
   * @default 1
   */
  max_soft_timeouts_per_generation?: number;
  /**
   * Custom prompt for generating the soft timeout filler message when use_llm_generated_message is enabled. Recent conversation context is provided as a separate user message. If not set, the default prompt will be used. Supports dynamic variables (e.g., {{system__time}}, {{custom_variable}}).
   */
  llm_generated_message_prompt_override?: string | null;
  /**
   * When true, soft timeout fillers are suppressed until the conversation has at least one real user message. Prevents fillers during the agent's opening turn (e.g. workflow generate-immediately / tool calls before the user speaks).
   * @default false
   */
  disable_until_first_user_message?: boolean;
};

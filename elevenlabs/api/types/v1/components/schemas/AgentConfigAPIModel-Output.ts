import type { DynamicVariablesConfig } from "./DynamicVariablesConfig.js";
import type { BehaviorOverride } from "./BehaviorOverride.js";
import type { PromptAgentAPIModel_Output } from "./PromptAgentAPIModel-Output.js";
/**
 * @example {"disable_first_message_interruptions":false,"first_message":"Hello, how can I help you today?","language":"en"}
 */
export type AgentConfigAPIModel_Output = {
  /**
   * If non-empty, the first message the agent will say. If empty, the agent waits for the user to start the discussion.
   * @default ""
   */
  first_message?: string;
  /**
   * Language of the agent - used for ASR and TTS
   * @default "en"
   */
  language?: string;
  /**
   * When enabled, the agent mixes English words and phrases into responses in Hindi, Malayalam, Telugu, or Kannada.
   * @default false
   */
  hinglish_mode?: boolean;
  /**
   * Configuration for dynamic variables
   */
  dynamic_variables?: DynamicVariablesConfig;
  /**
   * If true, the user will not be able to interrupt the agent while the first message is being delivered.
   * @default false
   */
  disable_first_message_interruptions?: boolean;
  /**
   * If non-empty, the message the agent will send when max conversation duration is reached.
   * @default ""
   */
  max_conversation_duration_message?: string;
  /**
   * Per-channel response behavior overrides for text conversations. Built-in channel defaults apply when unset.
   */
  text_behavior_overrides?: { [key: string]: BehaviorOverride } | null;
  /**
   * The prompt for the agent
   */
  prompt?: PromptAgentAPIModel_Output;
};

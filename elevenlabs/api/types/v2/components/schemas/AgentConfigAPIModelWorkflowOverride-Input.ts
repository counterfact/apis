import type { DynamicVariablesConfigWorkflowOverride } from "./DynamicVariablesConfigWorkflowOverride.js";
import type { BehaviorOverride } from "./BehaviorOverride.js";
import type { PromptAgentAPIModelWorkflowOverride_Input } from "./PromptAgentAPIModelWorkflowOverride-Input.js";
/**
 * @example {"disable_first_message_interruptions":false,"dynamic_variables":{"dynamic_variable_placeholders":{"user_name":"John Doe"}},"first_message":"Hello, how can I help you today?","language":"en","prompt":{"knowledge_base":[],"llm":"gemini-2.0-flash-001","max_tokens":-1,"prompt":"You are a helpful assistant that can answer questions about the topic of the conversation.","temperature":0,"tool_ids":[],"tools":[]}}
 */
export type AgentConfigAPIModelWorkflowOverride_Input = {
  /**
   * If non-empty, the first message the agent will say. If empty, the agent waits for the user to start the discussion.
   */
  first_message?: string | null;
  /**
   * Language of the agent - used for ASR and TTS
   */
  language?: string | null;
  /**
   * When enabled, the agent mixes English words and phrases into responses in Hindi, Malayalam, Telugu, or Kannada.
   */
  hinglish_mode?: boolean | null;
  /**
   * Configuration for dynamic variables
   */
  dynamic_variables?: DynamicVariablesConfigWorkflowOverride | null;
  /**
   * If true, the user will not be able to interrupt the agent while the first message is being delivered.
   */
  disable_first_message_interruptions?: boolean | null;
  /**
   * If non-empty, the message the agent will send when max conversation duration is reached.
   */
  max_conversation_duration_message?: string | null;
  /**
   * Per-channel response behavior overrides for text conversations. Built-in channel defaults apply when unset.
   */
  text_behavior_overrides?: { [key: string]: BehaviorOverride } | null;
  /**
   * The prompt for the agent
   */
  prompt?: PromptAgentAPIModelWorkflowOverride_Input | null;
};

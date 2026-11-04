import type { PromptAgentAPIModelOverride_Input } from "./PromptAgentAPIModelOverride-Input.js";
/**
 * @example {"first_message":"Hello, how can I help you today?","language":"en","prompt":{"knowledge_base":[],"llm":"gemini-2.0-flash-001","prompt":"You are a helpful assistant that can answer questions about the topic of the conversation.","tool_ids":[]}}
 */
export type AgentConfigOverride_Input = {
  /**
   * If non-empty, the first message the agent will say. If empty, the agent waits for the user to start the discussion.
   */
  first_message?: string | null;
  /**
   * Language of the agent - used for ASR and TTS
   */
  language?: string | null;
  /**
   * If non-empty, the message the agent will send when max conversation duration is reached.
   */
  max_conversation_duration_message?: string | null;
  /**
   * The prompt for the agent
   */
  prompt?: PromptAgentAPIModelOverride_Input | null;
};

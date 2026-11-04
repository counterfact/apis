import type { ASRConversationalConfigOverride } from "./ASRConversationalConfigOverride.js";
import type { TurnConfigOverride } from "./TurnConfigOverride.js";
import type { TTSConversationalConfigOverride } from "./TTSConversationalConfigOverride.js";
import type { ConversationConfigOverride } from "./ConversationConfigOverride.js";
import type { AgentConfigOverride_Input } from "./AgentConfigOverride-Input.js";
/**
 * @example {"agent":{"first_message":"Hello, how can I help you today?","language":"en","prompt":{"knowledge_base":[],"llm":"gemini-2.0-flash-001","prompt":"You are a helpful assistant that can answer questions about the topic of the conversation.","tool_ids":[]}},"asr":{"keywords":["hello","world"]},"conversation":{"max_duration_seconds":600},"tts":{"model_id":"eleven_turbo_v2","pronunciation_dictionary_locators":[],"similarity_boost":0.8,"speed":1,"stability":0.5,"voice_id":"cjVigY5qzO86Huf0OWal"},"turn":{"soft_timeout_config":{"message":"Hhmmmm...yeah."}}}
 */
export type ConversationConfigClientOverride_Input = {
  /**
   * Configuration for conversational transcription
   */
  asr?: ASRConversationalConfigOverride | null;
  /**
   * Configuration for turn detection
   */
  turn?: TurnConfigOverride | null;
  /**
   * Configuration for conversational text to speech
   */
  tts?: TTSConversationalConfigOverride | null;
  /**
   * Configuration for conversational events
   */
  conversation?: ConversationConfigOverride | null;
  /**
   * Agent specific configuration
   */
  agent?: AgentConfigOverride_Input | null;
};

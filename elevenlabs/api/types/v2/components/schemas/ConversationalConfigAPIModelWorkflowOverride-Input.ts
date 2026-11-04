import type { ASRConversationalConfigWorkflowOverride } from "./ASRConversationalConfigWorkflowOverride.js";
import type { TurnConfigWorkflowOverride } from "./TurnConfigWorkflowOverride.js";
import type { TTSConversationalConfigWorkflowOverride_Input } from "./TTSConversationalConfigWorkflowOverride-Input.js";
import type { ConversationConfigWorkflowOverride_Input } from "./ConversationConfigWorkflowOverride-Input.js";
import type { LanguagePreset_Input } from "./LanguagePreset-Input.js";
import type { VADConfigWorkflowOverride } from "./VADConfigWorkflowOverride.js";
import type { AgentConfigAPIModelWorkflowOverride_Input } from "./AgentConfigAPIModelWorkflowOverride-Input.js";
/**
 * @example {"agent":{"disable_first_message_interruptions":false,"dynamic_variables":{"dynamic_variable_placeholders":{"user_name":"John Doe"}},"first_message":"Hello, how can I help you today?","language":"en","prompt":{"knowledge_base":[],"llm":"gemini-2.0-flash-001","max_tokens":-1,"prompt":"You are a helpful assistant that can answer questions about the topic of the conversation.","temperature":0,"tool_ids":[],"tools":[]}},"asr":{"keywords":["hello","world"],"provider":"scribe_realtime","quality":"high","user_input_audio_format":"pcm_16000"},"conversation":{"client_events":["audio","interruption"],"max_duration_seconds":600},"tts":{"agent_output_audio_format":"pcm_16000","model_id":"eleven_turbo_v2","optimize_streaming_latency":3,"pronunciation_dictionary_locators":[],"similarity_boost":0.8,"speed":1,"stability":0.5,"voice_id":"cjVigY5qzO86Huf0OWal"},"turn":{"interruption_ignore_term_languages":[],"interruption_ignore_terms":[],"merge_with_default_ignore_terms":false,"mode":"turn","retranscribe_on_turn_timeout":false,"silence_end_call_timeout":-1,"soft_timeout_config":{"message":"Hhmmmm...yeah.","timeout_seconds":-1,"use_llm_generated_message":false},"speculative_turn":false,"spelling_patience":"auto","transcribe_on_disabled_interruptions":false,"turn_eagerness":"normal","turn_model":"turn_v3","turn_timeout":7},"vad":{"background_voice_detection":false}}
 */
export type ConversationalConfigAPIModelWorkflowOverride_Input = {
  /**
   * Configuration for conversational transcription
   */
  asr?: ASRConversationalConfigWorkflowOverride | null;
  /**
   * Configuration for turn detection
   */
  turn?: TurnConfigWorkflowOverride | null;
  /**
   * Configuration for conversational text to speech
   */
  tts?: TTSConversationalConfigWorkflowOverride_Input | null;
  /**
   * Configuration for conversational events
   */
  conversation?: ConversationConfigWorkflowOverride_Input | null;
  /**
   * Language presets for conversations
   */
  language_presets?: { [key: string]: LanguagePreset_Input } | null;
  /**
   * Configuration for voice activity detection
   */
  vad?: VADConfigWorkflowOverride | null;
  /**
   * Agent specific configuration
   */
  agent?: AgentConfigAPIModelWorkflowOverride_Input | null;
};

import type { ASRConversationalConfig } from "./ASRConversationalConfig.js";
import type { TurnConfig } from "./TurnConfig.js";
import type { TTSConversationalConfig_Input } from "./TTSConversationalConfig-Input.js";
import type { ConversationConfig_Input } from "./ConversationConfig-Input.js";
import type { LanguagePreset_Input } from "./LanguagePreset-Input.js";
import type { VADConfig } from "./VADConfig.js";
import type { AgentConfigAPIModel_Input } from "./AgentConfigAPIModel-Input.js";
export type ConversationalConfigAPIModel_Input = {
  /**
   * Configuration for conversational transcription
   */
  asr?: ASRConversationalConfig;
  /**
   * Configuration for turn detection
   */
  turn?: TurnConfig;
  /**
   * Configuration for conversational text to speech
   */
  tts?: TTSConversationalConfig_Input;
  /**
   * Configuration for conversational events
   */
  conversation?: ConversationConfig_Input;
  /**
   * Language presets for conversations
   */
  language_presets?: { [key: string]: LanguagePreset_Input };
  /**
   * Configuration for voice activity detection
   */
  vad?: VADConfig;
  /**
   * Agent specific configuration
   */
  agent?: AgentConfigAPIModel_Input;
};

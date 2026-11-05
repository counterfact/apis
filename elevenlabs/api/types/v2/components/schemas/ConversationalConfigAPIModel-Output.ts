import type { ASRConversationalConfig } from "./ASRConversationalConfig.js";
import type { TurnConfig } from "./TurnConfig.js";
import type { TTSConversationalConfig_Output } from "./TTSConversationalConfig-Output.js";
import type { ConversationConfig_Output } from "./ConversationConfig-Output.js";
import type { LanguagePreset_Output } from "./LanguagePreset-Output.js";
import type { VADConfig } from "./VADConfig.js";
import type { AgentConfigAPIModel_Output } from "./AgentConfigAPIModel-Output.js";
export type ConversationalConfigAPIModel_Output = {
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
  tts?: TTSConversationalConfig_Output;
  /**
   * Configuration for conversational events
   */
  conversation?: ConversationConfig_Output;
  /**
   * Language presets for conversations
   */
  language_presets?: { [key: string]: LanguagePreset_Output };
  /**
   * Configuration for voice activity detection
   */
  vad?: VADConfig;
  /**
   * Agent specific configuration
   */
  agent?: AgentConfigAPIModel_Output;
};

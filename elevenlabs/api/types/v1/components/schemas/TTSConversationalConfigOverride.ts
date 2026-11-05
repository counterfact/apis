import type { TTSConversationalModel } from "./TTSConversationalModel.js";
import type { SupportedVoice } from "./SupportedVoice.js";
import type { PydanticPronunciationDictionaryVersionLocator } from "./PydanticPronunciationDictionaryVersionLocator.js";
/**
 * @example {"model_id":"eleven_turbo_v2","pronunciation_dictionary_locators":[],"similarity_boost":0.8,"speed":1,"stability":0.5,"voice_id":"cjVigY5qzO86Huf0OWal"}
 */
export type TTSConversationalConfigOverride = {
  /**
   * The model to use for TTS
   */
  model_id?: TTSConversationalModel | null;
  /**
   * The voice ID to use for TTS
   */
  voice_id?: string | null;
  /**
   * Additional supported voices for the agent
   */
  supported_voices?: Array<SupportedVoice> | null;
  /**
   * The stability of generated speech
   */
  stability?: number | null;
  /**
   * The speed of generated speech
   */
  speed?: number | null;
  /**
   * The similarity boost for generated speech
   */
  similarity_boost?: number | null;
  /**
   * The clone strength for generated speech
   */
  clone_strength?: number | null;
  /**
   * The pronunciation dictionary locators
   */
  pronunciation_dictionary_locators?: Array<PydanticPronunciationDictionaryVersionLocator> | null;
};

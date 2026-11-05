import type { TTSConversationalModel } from "./TTSConversationalModel.js";
import type { SupportedVoice } from "./SupportedVoice.js";
import type { SuggestedAudioTag } from "./SuggestedAudioTag.js";
import type { TTSOutputFormat } from "./TTSOutputFormat.js";
import type { TTSOptimizeStreamingLatency } from "./TTSOptimizeStreamingLatency.js";
import type { TextNormalisationType } from "./TextNormalisationType.js";
import type { PydanticPronunciationDictionaryVersionLocator } from "./PydanticPronunciationDictionaryVersionLocator.js";
import type { EffectsSpec_Input } from "./EffectsSpec-Input.js";
/**
 * @example {"agent_output_audio_format":"pcm_16000","model_id":"eleven_turbo_v2","optimize_streaming_latency":3,"pronunciation_dictionary_locators":[],"similarity_boost":0.8,"speed":1,"stability":0.5,"voice_id":"cjVigY5qzO86Huf0OWal"}
 */
export type TTSConversationalConfig_Input = {
  /**
   * The model to use for TTS
   * @default "eleven_v4_turbo"
   */
  model_id?: TTSConversationalModel;
  /**
   * The voice ID to use for TTS
   * @default "cjVigY5qzO86Huf0OWal"
   */
  voice_id?: string;
  /**
   * Additional supported voices for the agent
   */
  supported_voices?: Array<SupportedVoice>;
  /**
   * When enabled, applies expressive audio tags prompt. Automatically disabled for non-v3 models.
   * @default true
   */
  expressive_mode?: boolean;
  /**
   * Suggested audio tags to boost expressive speech (for eleven_v3 and eleven_v3_conversational models). The agent can still use other tags not listed here.
   */
  suggested_audio_tags?: Array<SuggestedAudioTag>;
  /**
   * The audio format to use for TTS
   * @default "pcm_16000"
   */
  agent_output_audio_format?: TTSOutputFormat;
  /**
   * Deprecated: this field is a no-op and is ignored.
   * @default 3
   * @deprecated
   */
  optimize_streaming_latency?: TTSOptimizeStreamingLatency;
  /**
   * The stability of generated speech
   * @default 0.5
   */
  stability?: number;
  /**
   * The speed of generated speech
   * @default 1
   */
  speed?: number;
  /**
   * The similarity boost for generated speech
   * @default 0.8
   */
  similarity_boost?: number;
  /**
   * The clone strength for generated speech
   * @default 0
   */
  clone_strength?: number;
  /**
   * Method for converting numbers to words before converting text to speech. If set to SYSTEM_PROMPT, the system prompt will be updated to include normalization instructions. If set to ELEVENLABS, the text will be normalized after generation, incurring slight additional latency.
   * @default "system_prompt"
   */
  text_normalisation_type?: TextNormalisationType;
  /**
   * The pronunciation dictionary locators
   */
  pronunciation_dictionary_locators?: Array<PydanticPronunciationDictionaryVersionLocator>;
  /**
   * Opt-in to SSML phoneme tag handling for V3 models. When enabled, phoneme tags (inline and from pronunciation dictionaries) are parsed into inline IPA before being sent to the model.
   * @default true
   */
  enable_phoneme_tags?: boolean;
  /**
   * Optional TTS effects spec: filter preset, distance (proximity EQ), and environment (convolution reverb).
   */
  audio_effects?: EffectsSpec_Input | null;
};

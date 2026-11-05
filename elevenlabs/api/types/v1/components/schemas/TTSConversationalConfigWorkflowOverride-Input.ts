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
export type TTSConversationalConfigWorkflowOverride_Input = {
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
   * When enabled, applies expressive audio tags prompt. Automatically disabled for non-v3 models.
   */
  expressive_mode?: boolean | null;
  /**
   * Suggested audio tags to boost expressive speech (for eleven_v3 and eleven_v3_conversational models). The agent can still use other tags not listed here.
   */
  suggested_audio_tags?: Array<SuggestedAudioTag> | null;
  /**
   * The audio format to use for TTS
   */
  agent_output_audio_format?: TTSOutputFormat | null;
  /**
   * Deprecated: this field is a no-op and is ignored.
   */
  optimize_streaming_latency?: TTSOptimizeStreamingLatency | null;
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
   * Method for converting numbers to words before converting text to speech. If set to SYSTEM_PROMPT, the system prompt will be updated to include normalization instructions. If set to ELEVENLABS, the text will be normalized after generation, incurring slight additional latency.
   */
  text_normalisation_type?: TextNormalisationType | null;
  /**
   * The pronunciation dictionary locators
   */
  pronunciation_dictionary_locators?: Array<PydanticPronunciationDictionaryVersionLocator> | null;
  /**
   * Opt-in to SSML phoneme tag handling for V3 models. When enabled, phoneme tags (inline and from pronunciation dictionaries) are parsed into inline IPA before being sent to the model.
   */
  enable_phoneme_tags?: boolean | null;
  /**
   * Optional TTS effects spec: filter preset, distance (proximity EQ), and environment (convolution reverb).
   */
  audio_effects?: EffectsSpec_Input | null;
};

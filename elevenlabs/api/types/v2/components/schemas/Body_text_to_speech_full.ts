import type { VoiceSettingsResponseModel } from "./VoiceSettingsResponseModel.js";
import type { PronunciationDictionaryVersionLocatorRequestModel } from "./PronunciationDictionaryVersionLocatorRequestModel.js";
import type { EffectsSpec_Input } from "./EffectsSpec-Input.js";
export type Body_text_to_speech_full = {
  /**
   * The text that will get converted into speech.
   */
  text: string;
  /**
   * Identifier of the model that will be used, you can query them using GET /v1/models. The model needs to have support for text to speech, you can check this using the can_do_text_to_speech property.
   * @default "eleven_multilingual_v2"
   */
  model_id?: string;
  /**
   * Language code (ISO 639-1) used to enforce a language for the model and text normalization. If the model does not support the provided language code, it will be ignored. This parameter is not supported for multilingual_v2 models.
   */
  language_code?: string | null;
  /**
   * Voice settings overriding stored settings for the given voice. They are applied only on the given request.
   */
  voice_settings?: VoiceSettingsResponseModel | null;
  /**
   * A list of pronunciation dictionary locators (id, version_id) to be applied to the text. They will be applied in order. You may have up to 3 locators per request
   */
  pronunciation_dictionary_locators?: Array<PronunciationDictionaryVersionLocatorRequestModel> | null;
  /**
   * If specified, our system will make a best effort to sample deterministically, such that repeated requests with the same seed and parameters should return the same result. Determinism is not guaranteed. Must be integer between 0 and 4294967295.
   */
  seed?: number | null;
  /**
   * The text that came before the text of the current request. Can be used to improve the speech's continuity when concatenating together multiple generations or to influence the speech's continuity in the current generation.
   */
  previous_text?: string | null;
  /**
   * The text that comes after the text of the current request. Can be used to improve the speech's continuity when concatenating together multiple generations or to influence the speech's continuity in the current generation.
   */
  next_text?: string | null;
  /**
   * A list of request_id of the samples that were generated before this generation. Can be used to improve the speech's continuity when splitting up a large task into multiple requests. The results will be best when the same model is used across the generations. In case both previous_text and previous_request_ids is send, previous_text will be ignored. A maximum of 3 request_ids can be sent.
   */
  previous_request_ids?: Array<string> | null;
  /**
   * A list of request_id of the samples that come after this generation. next_request_ids is especially useful for maintaining the speech's continuity when regenerating a sample that has had some audio quality issues. For example, if you have generated 3 speech clips, and you want to improve clip 2, passing the request id of clip 3 as a next_request_id (and that of clip 1 as a previous_request_id) will help maintain natural flow in the combined speech. The results will be best when the same model is used across the generations. In case both next_text and next_request_ids is send, next_text will be ignored. A maximum of 3 request_ids can be sent.
   */
  next_request_ids?: Array<string> | null;
  /**
   * Whether to use the IVC version of a professional voice. This may improve expressiveness and reduce latency.
   */
  use_pvc_as_ivc?: boolean | null;
  /**
   * This parameter controls text normalization with three modes: 'auto', 'on', and 'off'. When set to 'auto', the system will automatically decide whether to apply text normalization (e.g., spelling out numbers). With 'on', text normalization will always be applied, while with 'off', it will be skipped.
   * @default "auto"
   */
  apply_text_normalization?: "auto" | "on" | "off";
  /**
   * This parameter controls language text normalization. This helps with proper pronunciation of text in some supported languages. WARNING: This parameter can heavily increase the latency of the request. Currently only supported for Japanese.
   * @default false
   */
  apply_language_text_normalization?: boolean;
  /**
   * Audio effects applied to the generated audio. Unknown IDs return 404 with `param` naming the field. Reverb (`environment_id` with `send_level` above 0) and a non-zero `pan` produce stereo audio and are rejected with 400 for `ulaw_*`, `alaw_*`, and `pcm_*` output formats. Effects don't change the cost of the request.
   */
  audio_effects?: EffectsSpec_Input | null;
};

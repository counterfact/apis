import type { DialogueInput } from "./DialogueInput.js";
import type { ToDialogueSettingsResponseModel } from "./ToDialogueSettingsResponseModel.js";
import type { PronunciationDictionaryVersionLocatorRequestModel } from "./PronunciationDictionaryVersionLocatorRequestModel.js";
import type { EffectsSpec_Input } from "./EffectsSpec-Input.js";
export type Body_text_to_dialogue_full_with_timestamps = {
  /**
   * A list of dialogue inputs, each containing text and a voice ID which will be converted into speech. The maximum number of unique voice IDs is 10. For reliable generation, keep the total character count across all `inputs[].text` values at or below 2,000 characters per request. Longer requests can terminate early in streaming responses or return a validation error.
   */
  inputs: Array<DialogueInput>;
  /**
   * Identifier of the model that will be used, you can query them using GET /v1/models. The model needs to have support for text to speech, you can check this using the can_do_text_to_speech property.
   * @default "eleven_v3"
   */
  model_id?: string;
  /**
   * Language code (ISO 639-1) used to enforce a language for the model and text normalization. If the model does not support the provided language code, it will be ignored. This parameter is not supported for multilingual_v2 models.
   */
  language_code?: string | null;
  /**
   * Settings controlling the dialogue generation.
   */
  settings?: ToDialogueSettingsResponseModel | null;
  /**
   * A list of pronunciation dictionary locators (id, version_id) to be applied to the text. They will be applied in order. You may have up to 3 locators per request
   */
  pronunciation_dictionary_locators?: Array<PronunciationDictionaryVersionLocatorRequestModel> | null;
  /**
   * If specified, our system will make a best effort to sample deterministically, such that repeated requests with the same seed and parameters should return the same result. Determinism is not guaranteed. Must be integer between 0 and 4294967295.
   */
  seed?: number | null;
  /**
   * This parameter controls text normalization with three modes: 'auto', 'on', and 'off'. When set to 'auto', the system will automatically decide whether to apply text normalization (e.g., spelling out numbers). With 'on', text normalization will always be applied, while with 'off', it will be skipped.
   * @default "auto"
   */
  apply_text_normalization?: "auto" | "on" | "off";
  /**
   * Whether to use the IVC version of a professional voice. This may improve expressiveness and reduce latency.
   * @deprecated
   */
  use_pvc_as_ivc?: boolean | null;
  /**
   * A list of request_ids of dialogue generations that came before this one. Used to condition the model for continuity when splitting a large task into multiple requests. A maximum of 3 request_ids can be sent. The last request_id is the audio which is closest to the current request. Not supported by every model.
   */
  previous_request_ids?: Array<string> | null;
  /**
   * A list of request_ids of dialogue generations that come after this one. Useful for maintaining continuity when regenerating a clip in the middle of a sequence. A maximum of 3 request_ids can be sent. The first request_id is the audio which is closest to the current request. Not supported by every model.
   */
  next_request_ids?: Array<string> | null;
  /**
   * The text that comes immediately before this generation, used to condition the model for prosodic continuity. A maximum of 100 characters can be sent. Not supported by every model.
   */
  previous_text?: string | null;
  /**
   * The text that comes immediately after this generation, used to condition the model for prosodic continuity. A maximum of 100 characters can be sent. Not supported by every model.
   */
  future_text?: string | null;
  /**
   * Audio effects applied to the generated audio. Unknown IDs return 404 with `param` naming the field. Reverb (`environment_id` with `send_level` above 0) and a non-zero `pan` produce stereo audio and are rejected with 400 for `ulaw_*`, `alaw_*`, and `pcm_*` output formats. Effects don't change the cost of the request.
   */
  audio_effects?: EffectsSpec_Input | null;
};

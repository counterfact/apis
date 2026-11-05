import type { LanguageResponseModel } from "./LanguageResponseModel.js";
import type { ModelRatesResponseModel } from "./ModelRatesResponseModel.js";
/**
 * @example {"can_be_finetuned":true,"can_do_text_to_speech":true,"can_do_voice_conversion":true,"can_use_speaker_boost":true,"can_use_style":true,"concurrency_group":"standard_eleven_multilingual_v2","description":"Our state of the art multilingual speech synthesis model, able to generate life-like speech in 29 languages.","languages":[{"language_id":"en","name":"English"}],"max_characters_request_free_user":2500,"max_characters_request_subscribed_user":5000,"maximum_text_length_per_request":1000000,"model_id":"eleven_multilingual_v2","model_rates":{"character_cost_multiplier":1,"cost_discount_multiplier":1},"name":"Eleven Multilingual v2","requires_alpha_access":false,"serves_pro_voices":false,"token_cost_factor":1}
 */
export type ModelResponseModel = {
  /**
   * The unique identifier of the model.
   */
  model_id: string;
  /**
   * The name of the model.
   */
  name: string;
  /**
   * Whether the model can be finetuned.
   */
  can_be_finetuned: boolean;
  /**
   * Whether the model can do text-to-speech.
   */
  can_do_text_to_speech: boolean;
  /**
   * Whether the model can do voice conversion.
   */
  can_do_voice_conversion: boolean;
  /**
   * Whether the model can use style.
   */
  can_use_style: boolean;
  /**
   * Whether the model can use speaker boost.
   */
  can_use_speaker_boost: boolean;
  /**
   * Whether the model serves pro voices.
   */
  serves_pro_voices: boolean;
  /**
   * The cost factor for the model.
   */
  token_cost_factor: number;
  /**
   * The description of the model.
   */
  description: string;
  /**
   * Whether the model requires alpha access.
   */
  requires_alpha_access: boolean;
  /**
   * Deprecated. Not enforced; use `maximum_text_length_per_request` instead.
   * @deprecated
   */
  max_characters_request_free_user: number;
  /**
   * Deprecated. Not enforced; use `maximum_text_length_per_request` instead.
   * @deprecated
   */
  max_characters_request_subscribed_user: number;
  /**
   * The maximum number of input text characters accepted per request for this model. Longer requests are rejected.
   */
  maximum_text_length_per_request: number;
  /**
   * The languages supported by the model.
   */
  languages: Array<LanguageResponseModel>;
  /**
   * The rates for the model.
   */
  model_rates: ModelRatesResponseModel;
  /**
   * The concurrency group for the model.
   */
  concurrency_group: string;
};

import type { VoiceAccentResponseModel } from "./VoiceAccentResponseModel.js";
/**
 * @example {"accents":[{"accent":"american","code":"en-american","language":"en","name":"American"}]}
 */
export type GetVoiceAccentsResponseModel = {
  /**
   * A list of available voice accents.
   */
  accents: Array<VoiceAccentResponseModel>;
};

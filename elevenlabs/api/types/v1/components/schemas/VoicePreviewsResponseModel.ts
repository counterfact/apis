import type { VoicePreviewResponseModel } from "./VoicePreviewResponseModel.js";
export type VoicePreviewsResponseModel = {
  /**
   * The previews of the generated voices.
   */
  previews: Array<VoicePreviewResponseModel>;
  /**
   * The text used to preview the voices.
   */
  text: string;
};

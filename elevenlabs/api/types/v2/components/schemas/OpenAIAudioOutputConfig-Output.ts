import type { OpenAIAudioOutputFormat } from "./OpenAIAudioOutputFormat.js";
export type OpenAIAudioOutputConfig_Output = {
  format?: OpenAIAudioOutputFormat;
  /**
   * @default "brian"
   */
  voice?: string;
};

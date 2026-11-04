import type { OpenAIAudioOutputFormat } from "./OpenAIAudioOutputFormat.js";
export type OpenAIAudioOutputConfig_Input = {
  format?: OpenAIAudioOutputFormat;
  /**
   * @default "brian"
   */
  voice?: string;
};

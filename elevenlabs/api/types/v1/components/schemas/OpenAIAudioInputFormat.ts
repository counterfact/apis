import type { AudioFormat } from "./AudioFormat.js";
export type OpenAIAudioInputFormat = {
  /**
   * @default "audio/pcm"
   */
  type?: AudioFormat;
  /**
   * @default 24000
   */
  rate?: number;
};

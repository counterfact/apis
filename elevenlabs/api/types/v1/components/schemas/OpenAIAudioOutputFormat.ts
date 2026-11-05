import type { AudioFormat } from "./AudioFormat.js";
export type OpenAIAudioOutputFormat = {
  /**
   * @default "audio/pcm"
   */
  type?: AudioFormat;
};

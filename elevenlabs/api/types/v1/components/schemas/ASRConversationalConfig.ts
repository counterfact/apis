import type { ASRQuality } from "./ASRQuality.js";
import type { ASRProvider } from "./ASRProvider.js";
import type { ASRInputFormat } from "./ASRInputFormat.js";
/**
 * @example {"keywords":["hello","world"],"provider":"scribe_realtime","quality":"high","user_input_audio_format":"pcm_16000"}
 */
export type ASRConversationalConfig = {
  /**
   * The quality of the transcription
   * @default "high"
   */
  quality?: ASRQuality;
  /**
   * The provider of the transcription service
   * @default "scribe_realtime"
   */
  provider?: ASRProvider;
  /**
   * The format of the audio to be transcribed
   * @default "pcm_16000"
   */
  user_input_audio_format?: ASRInputFormat;
  /**
   * Keywords to boost prediction probability for
   */
  keywords?: Array<string>;
};

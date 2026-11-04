import type { ASRQuality } from "./ASRQuality.js";
import type { ASRProvider } from "./ASRProvider.js";
import type { ASRInputFormat } from "./ASRInputFormat.js";
/**
 * @example {"keywords":["hello","world"],"provider":"scribe_realtime","quality":"high","user_input_audio_format":"pcm_16000"}
 */
export type ASRConversationalConfigWorkflowOverride = {
  /**
   * The quality of the transcription
   */
  quality?: ASRQuality | null;
  /**
   * The provider of the transcription service
   */
  provider?: ASRProvider | null;
  /**
   * The format of the audio to be transcribed
   */
  user_input_audio_format?: ASRInputFormat | null;
  /**
   * Keywords to boost prediction probability for
   */
  keywords?: Array<string> | null;
};

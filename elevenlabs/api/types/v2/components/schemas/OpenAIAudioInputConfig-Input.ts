import type { OpenAIAudioInputFormat } from "./OpenAIAudioInputFormat.js";
import type { OpenAIAudioInputTranscription } from "./OpenAIAudioInputTranscription.js";
import type { OpenAITurnDetection } from "./OpenAITurnDetection.js";
import type { AudioInputPacing } from "./AudioInputPacing.js";
export type OpenAIAudioInputConfig_Input = {
  format?: OpenAIAudioInputFormat;
  transcription?: OpenAIAudioInputTranscription | null;
  turn_detection?: OpenAITurnDetection | null;
  /**
   * @default "realtime"
   */
  pacing?: AudioInputPacing;
};

import type { UtteranceResponseModel } from "./UtteranceResponseModel.js";
/**
 * @example {"duration_secs":5,"speaker_id":"DCwhRBWXzGAHq8TQ4Fs18"}
 */
export type SpeakerResponseModel = {
  /**
   * The ID of the speaker.
   */
  speaker_id: string;
  /**
   * The duration of the speaker segment in seconds.
   */
  duration_secs: number;
  /**
   * The utterances of the speaker.
   */
  utterances?: Array<UtteranceResponseModel> | null;
};

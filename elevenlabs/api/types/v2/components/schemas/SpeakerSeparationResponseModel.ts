import type { SpeakerResponseModel } from "./SpeakerResponseModel.js";
/**
 * @example {"sample_id":"DCwhRBWXzGAHq8TQ4Fs18","status":"not_started","voice_id":"DCwhRBWXzGAHq8TQ4Fs18"}
 */
export type SpeakerSeparationResponseModel = {
  /**
   * The ID of the voice.
   */
  voice_id: string;
  /**
   * The ID of the sample.
   */
  sample_id: string;
  /**
   * The status of the speaker separation.
   */
  status: "not_started" | "pending" | "completed" | "failed";
  /**
   * The speakers of the sample.
   */
  speakers?: { [key: string]: SpeakerResponseModel } | null;
  /**
   * The IDs of the selected speakers.
   */
  selected_speaker_ids?: Array<string> | null;
};

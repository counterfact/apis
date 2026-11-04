import type { SpeakerSeparationResponseModel } from "./SpeakerSeparationResponseModel.js";
/**
 * @example {"file_name":"sample.mp3","hash":"1234567890","mime_type":"audio/mpeg","sample_id":"DCwhRBWXzGAHq8TQ4Fs18","size_bytes":1000000}
 */
export type SampleResponseModel = {
  /**
   * The ID of the sample.
   */
  sample_id: string;
  /**
   * The name of the sample file.
   */
  file_name: string;
  /**
   * The MIME type of the sample file.
   */
  mime_type: string;
  /**
   * The size of the sample file in bytes.
   */
  size_bytes: number;
  /**
   * The hash of the sample file.
   */
  hash: string;
  duration_secs?: number | null;
  remove_background_noise?: boolean | null;
  has_isolated_audio?: boolean | null;
  has_isolated_audio_preview?: boolean | null;
  speaker_separation?: SpeakerSeparationResponseModel | null;
  trim_start?: number | null;
  trim_end?: number | null;
};

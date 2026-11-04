/**
 * @example {"audio_base_64":"audio_base_64","duration_secs":5,"media_type":"audio/mpeg","sample_id":"DCwhRBWXzGAHq8TQ4Fs18","voice_id":"DCwhRBWXzGAHq8TQ4Fs18"}
 */
export type VoiceSamplePreviewResponseModel = {
  /**
   * The base64 encoded audio.
   */
  audio_base_64: string;
  /**
   * The ID of the voice.
   */
  voice_id: string;
  /**
   * The ID of the sample.
   */
  sample_id: string;
  /**
   * The media type of the audio.
   */
  media_type: string;
  /**
   * The duration of the audio in seconds.
   */
  duration_secs?: number | null;
};

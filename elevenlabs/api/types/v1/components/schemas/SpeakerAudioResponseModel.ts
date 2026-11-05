/**
 * @example {"audio_base_64":"audio_base_64","duration_secs":5,"media_type":"audio/mpeg"}
 */
export type SpeakerAudioResponseModel = {
  /**
   * The base64 encoded audio.
   */
  audio_base_64: string;
  /**
   * The media type of the audio.
   */
  media_type: string;
  /**
   * The duration of the audio in seconds.
   */
  duration_secs: number;
};

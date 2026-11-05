export type VoicePreviewResponseModel = {
  /**
   * The base64 encoded audio of the preview.
   */
  audio_base_64: string;
  /**
   * The ID of the generated voice. Use it to create a voice from the preview.
   */
  generated_voice_id: string;
  /**
   * The media type of the preview.
   */
  media_type: string;
  /**
   * The duration of the preview in seconds.
   */
  duration_secs: number;
  /**
   * The language of the preview.
   */
  language: string | null;
};

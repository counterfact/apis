export type Body_Edit_voice_v1_voices__voice_id__edit_post = {
  /**
   * The name that identifies this voice. This will be displayed in the dropdown of the website.
   */
  name: string;
  /**
   * Audio files to add to the voice
   */
  files?: Array<Uint8Array | string>;
  /**
   * If set will remove background noise for voice samples using our audio isolation model. If the samples do not include background noise, it can make the quality worse.
   * @default false
   */
  remove_background_noise?: boolean;
  /**
   * A description of the voice.
   */
  description?: string | null;
  /**
   * Labels for the voice. Keys can be language, accent, gender, or age.
   */
  labels?: { [key: string]: string } | string | null;
  /**
   * Run synchronous LLM moderation over the voice name and description when they change. Has no effect unless the voice_library_metadata_moderation feature flag is enabled for the user.
   * @default false
   */
  moderate_metadata?: boolean;
};

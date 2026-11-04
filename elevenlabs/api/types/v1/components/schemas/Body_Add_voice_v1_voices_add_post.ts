export type Body_Add_voice_v1_voices_add_post = {
  /**
   * The name that identifies this voice. This will be displayed in the dropdown of the website.
   */
  name: string;
  /**
   * A list of file paths to audio recordings intended for voice cloning.
   */
  files: Array<Uint8Array | string>;
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
};

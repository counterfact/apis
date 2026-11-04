export type Body_Create_PVC_voice_v1_voices_pvc_post = {
  /**
   * The name that identifies this voice. This will be displayed in the dropdown of the website.
   */
  name: string;
  /**
   * Language used in the samples.
   */
  language: string;
  /**
   * Description to use for the created voice.
   */
  description?: string | null;
  /**
   * Labels for the voice. Keys can be language, accent, gender, or age.
   */
  labels?: { [key: string]: string } | null;
};

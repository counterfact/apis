export type Body_Create_a_new_voice_from_voice_preview_v1_text_to_voice_post = {
  /**
   * Name to use for the created voice.
   */
  voice_name: string;
  /**
   * Description to use for the created voice.
   */
  voice_description: string;
  /**
   * The generated_voice_id to create; obtain it from POST /v1/text-to-voice/design, POST /v1/text-to-voice/:voice_id/remix, or the response headers when generating previews.
   */
  generated_voice_id: string;
  /**
   * Optional, metadata to add to the created voice. Defaults to None.
   */
  labels?: { [key: string]: string } | null;
  /**
   * List of voice ids that the user has played but not selected. Used for RLHF.
   */
  played_not_selected_voice_ids?: Array<string> | null;
};

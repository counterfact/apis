export type Body_Update_audio_native_content_from_URL_v1_audio_native_content_post =
  {
    /**
     * URL of the page to extract content from.
     */
    url: string;
    /**
     * Author used in the player and inserted at the start of the uploaded article. If not provided, the default author set in the Player settings is used.
     */
    author?: string | null;
    /**
     * Title used in the player and inserted at the top of the uploaded article. If not provided, the default title set in the Player settings is used.
     */
    title?: string | null;
  };

export type Body_Creates_Audio_Native_enabled_project__v1_audio_native_post = {
  /**
   * Project name.
   */
  name: string;
  /**
   * (Deprecated) Image URL used in the player. If not provided, default image set in the Player settings is used.
   * @deprecated
   */
  image?: string | null;
  /**
   * Author used in the player and inserted at the start of the uploaded article. If not provided, the default author set in the Player settings is used.
   */
  author?: string | null;
  /**
   * Title used in the player and inserted at the top of the uploaded article. If not provided, the default title set in the Player settings is used.
   */
  title?: string | null;
  /**
   * (Deprecated) Whether to use small player or not. If not provided, default value set in the Player settings is used.
   * @default false
   * @deprecated
   */
  small?: boolean;
  /**
   * Text color used in the player. If not provided, default text color set in the Player settings is used.
   */
  text_color?: string | null;
  /**
   * Background color used in the player. If not provided, default background color set in the Player settings is used.
   */
  background_color?: string | null;
  /**
   * (Deprecated) Specifies for how many minutes to persist the session across page reloads. If not provided, default sessionization set in the Player settings is used.
   * @default 0
   * @deprecated
   */
  sessionization?: number;
  /**
   * Voice ID used to voice the content. If not provided, default voice ID set in the Player settings is used.
   */
  voice_id?: string | null;
  /**
   * TTS Model ID used in the player. If not provided, default model ID set in the Player settings is used.
   */
  model_id?: string | null;
  /**
   * Either txt or HTML input file containing the article content. HTML should be formatted as follows '&lt;html&gt;&lt;body&gt;&lt;div&gt;&lt;p&gt;Your content&lt;/p&gt;&lt;h3&gt;More of your content&lt;/h3&gt;&lt;p&gt;Some more of your content&lt;/p&gt;&lt;/div&gt;&lt;/body&gt;&lt;/html&gt;'
   * @format binary
   */
  file?: Uint8Array | string;
  /**
   * Whether to auto convert the project to audio or not.
   * @default false
   */
  auto_convert?: boolean;
  /**
   *
   *     This parameter controls text normalization with four modes: 'auto', 'on', 'apply_english' and 'off'.
   *     When set to 'auto', the system will automatically decide whether to apply text normalization
   *     (e.g., spelling out numbers). With 'on', text normalization will always be applied, while
   *     with 'off', it will be skipped. 'apply_english' is the same as 'on' but will assume that text is in English.
   *
   */
  apply_text_normalization?: ("auto" | "on" | "off" | "apply_english") | null;
  /**
   * A list of pronunciation dictionary locators (pronunciation_dictionary_id, version_id) encoded as a list of JSON strings for pronunciation dictionaries to be applied to the text. A list of json encoded strings is required as adding projects may occur through formData as opposed to jsonBody. To specify multiple dictionaries use multiple --form lines in your curl, such as --form 'pronunciation_dictionary_locators="{\"pronunciation_dictionary_id\":\"Vmd4Zor6fplcA7WrINey\",\"version_id\":\"hRPaxjlTdR7wFMhV4w0b\"}"' --form 'pronunciation_dictionary_locators="{\"pronunciation_dictionary_id\":\"JzWtcGQMJ6bnlWwyMo7e\",\"version_id\":\"lbmwxiLu4q6txYxgdZqn\"}"'.
   */
  pronunciation_dictionary_locators?: Array<string>;
};

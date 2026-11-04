export type TTSConversationalConfigOverrideConfig = {
  /**
   * Whether to allow overriding the model_id field.
   * @default false
   */
  model_id?: boolean;
  /**
   * Whether to allow overriding the voice_id field.
   * @default false
   */
  voice_id?: boolean;
  /**
   * Whether to allow overriding the supported_voices field.
   * @default false
   */
  supported_voices?: boolean;
  /**
   * Whether to allow overriding the stability field.
   * @default false
   */
  stability?: boolean;
  /**
   * Whether to allow overriding the speed field.
   * @default false
   */
  speed?: boolean;
  /**
   * Whether to allow overriding the similarity_boost field.
   * @default false
   */
  similarity_boost?: boolean;
  /**
   * Whether to allow overriding the clone_strength field.
   * @default false
   */
  clone_strength?: boolean;
  /**
   * Whether to allow overriding the pronunciation_dictionary_locators field.
   * @default false
   */
  pronunciation_dictionary_locators?: boolean;
};

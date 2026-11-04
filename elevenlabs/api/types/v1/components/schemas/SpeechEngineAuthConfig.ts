export type SpeechEngineAuthConfig = {
  /**
   * If true, starting a conversation with the speech engine requires a signed URL or token from an authorized caller, rather than only its ID
   * @default false
   */
  enable_auth?: boolean;
};

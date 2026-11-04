/**
 * @example {"accent":"American","language":"en","model_id":"eleven_turbo_v2_5"}
 */
export type VerifiedVoiceLanguageResponseModel = {
  /**
   * The language of the voice.
   */
  language: string;
  /**
   * The voice's model ID.
   */
  model_id: string;
  /**
   * The voice's accent, if applicable.
   */
  accent?: string | null;
  /**
   * The voice's locale, if applicable.
   */
  locale?: string | null;
  /**
   * The voice's preview URL, if applicable.
   */
  preview_url?: string | null;
};

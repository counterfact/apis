/**
 * @example {"max_duration_seconds":600}
 */
export type ConversationConfigOverride = {
  /**
   * If enabled audio will not be processed and only text will be used, use to avoid audio pricing.
   */
  text_only?: boolean | null;
  /**
   * The maximum duration of a conversation in seconds
   */
  max_duration_seconds?: number | null;
};

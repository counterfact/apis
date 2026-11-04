/**
 * @example {"alphabet":"ipa","case_sensitive":true,"phoneme":"/ˈtaɪ.lænd/","string_to_replace":"Thailand","type":"phoneme","word_boundaries":true}
 */
export type PronunciationDictionaryPhonemeRuleRequestModel = {
  /**
   * The string to replace. Must be a non-empty string.
   */
  string_to_replace: string;
  /**
   * Whether the rule should match case-sensitively.
   * @default true
   */
  case_sensitive?: boolean;
  /**
   * Whether the rule should only match at word boundaries.
   * @default true
   */
  word_boundaries?: boolean;
  /**
   * The type of the rule.
   */
  type: "phoneme";
  /**
   * The phoneme rule.
   */
  phoneme: string;
  /**
   * The alphabet to use with the phoneme rule.
   */
  alphabet: string;
};

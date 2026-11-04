/**
 * @example {"alias":"tie-land","case_sensitive":true,"string_to_replace":"Thailand","type":"alias","word_boundaries":true}
 */
export type PronunciationDictionaryAliasRuleRequestModel = {
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
  type: "alias";
  /**
   * The alias for the string to be replaced.
   */
  alias: string;
};

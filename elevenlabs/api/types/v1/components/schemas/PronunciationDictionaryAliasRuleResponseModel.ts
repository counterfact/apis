export type PronunciationDictionaryAliasRuleResponseModel = {
  string_to_replace: string;
  /**
   * Whether the rule matches case-sensitively.
   * @default true
   */
  case_sensitive?: boolean;
  /**
   * Whether the rule only matches at word boundaries.
   * @default true
   */
  word_boundaries?: boolean;
  type: "alias";
  alias: string;
};

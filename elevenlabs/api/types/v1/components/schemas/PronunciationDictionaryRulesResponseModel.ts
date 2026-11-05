/**
 * @example {"id":"5xM3yVvZQKV0EfqQpLrJ","version_id":"5xM3yVvZQKV0EfqQpLr2","version_rules_num":5}
 */
export type PronunciationDictionaryRulesResponseModel = {
  /**
   * The ID of the pronunciation dictionary.
   */
  id: string;
  /**
   * The version ID of the pronunciation dictionary.
   */
  version_id: string;
  /**
   * The number of rules in the version of the pronunciation dictionary.
   */
  version_rules_num: number;
};

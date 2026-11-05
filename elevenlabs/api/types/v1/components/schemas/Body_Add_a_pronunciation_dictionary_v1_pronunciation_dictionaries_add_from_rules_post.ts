import type { PronunciationDictionaryAliasRuleRequestModel } from "./PronunciationDictionaryAliasRuleRequestModel.js";
import type { PronunciationDictionaryPhonemeRuleRequestModel } from "./PronunciationDictionaryPhonemeRuleRequestModel.js";
export type Body_Add_a_pronunciation_dictionary_v1_pronunciation_dictionaries_add_from_rules_post =
  {
    /**
     * List of pronunciation rules. Rule can be either:
     *     an alias rule: {'string_to_replace': 'a', 'type': 'alias', 'alias': 'b', }
     *     or a phoneme rule: {'string_to_replace': 'a', 'type': 'phoneme', 'phoneme': 'b', 'alphabet': 'ipa' }
     */
    rules: Array<
      | PronunciationDictionaryAliasRuleRequestModel
      | PronunciationDictionaryPhonemeRuleRequestModel
    >;
    /**
     * The name of the pronunciation dictionary, used for identification only.
     */
    name: string;
    /**
     * A description of the pronunciation dictionary, used for identification only.
     */
    description?: string | null;
    /**
     * Should be one of 'admin', 'editor' or 'viewer'. If not provided, defaults to no access.
     */
    workspace_access?: ("admin" | "editor" | "commenter" | "viewer") | null;
  };

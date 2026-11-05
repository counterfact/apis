import type { PronunciationDictionaryAliasRuleRequestModel } from "./PronunciationDictionaryAliasRuleRequestModel.js";
import type { PronunciationDictionaryPhonemeRuleRequestModel } from "./PronunciationDictionaryPhonemeRuleRequestModel.js";
export type Body_Set_rules_on_the_pronunciation_dictionary_v1_pronunciation_dictionaries__pronunciation_dictionary_id__set_rules_post =
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
  };

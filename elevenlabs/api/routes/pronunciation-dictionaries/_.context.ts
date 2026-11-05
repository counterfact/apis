import type { GetPronunciationDictionaryMetadataResponseModel as Metadata } from "../../types/v1/components/schemas/GetPronunciationDictionaryMetadataResponseModel.js";
import type { GetPronunciationDictionariesMetadataResponseModel as DictionaryPage } from "../../types/v1/components/schemas/GetPronunciationDictionariesMetadataResponseModel.js";
import type { PronunciationDictionaryAliasRuleRequestModel } from "../../types/v1/components/schemas/PronunciationDictionaryAliasRuleRequestModel.js";
import type { PronunciationDictionaryPhonemeRuleRequestModel } from "../../types/v1/components/schemas/PronunciationDictionaryPhonemeRuleRequestModel.js";
import type { HTTP_GET_Query } from "../../types/v1/paths/pronunciation-dictionaries.types.js";
import type { Body_Add_a_pronunciation_dictionary_v1_pronunciation_dictionaries_add_from_rules_post as CreateDictionary } from "../../types/v1/components/schemas/Body_Add_a_pronunciation_dictionary_v1_pronunciation_dictionaries_add_from_rules_post.js";
import type { AddPronunciationDictionaryResponseModel as CreatedDictionary } from "../../types/v1/components/schemas/AddPronunciationDictionaryResponseModel.js";
import type { PronunciationDictionaryRulesResponseModel as RulesVersion } from "../../types/v1/components/schemas/PronunciationDictionaryRulesResponseModel.js";

export type DictionaryRule = PronunciationDictionaryAliasRuleRequestModel | PronunciationDictionaryPhonemeRuleRequestModel;
export type DictionaryRecord = {
  metadata: Metadata;
  /** Each version retains its own rules snapshot; later changes add versions. */
  versions: Map<string, readonly DictionaryRule[]>;
};
type ListResult = { page: DictionaryPage; error?: never } | { page?: never; error: string };
type CreateResult = { value: CreatedDictionary; error?: never } | { value?: never; error: string };
type RulesResult =
  | { value: RulesVersion; error?: never; missing?: never }
  | { value?: never; error: string; missing?: never }
  | { value?: never; error?: never; missing: true };

export class Context {
  dictionaries = new Map<string, DictionaryRecord>();
  nextDictionaryNumber = 0;
  creationDefaults?: { createdBy: string; timeUnix: number };

  addRules(id: string, rules: DictionaryRule[]): RulesResult {
    const dictionary = this.dictionaries.get(id);
    if (!dictionary) return { missing: true };
    if (rules.some((rule) => rule.string_to_replace.length === 0)) {
      return { error: "Rule string_to_replace must be non-empty" };
    }
    const current = dictionary.versions.get(dictionary.metadata.latest_version_id)!;
    // Matching is exact and case-sensitive; the last supplied rule wins.
    const combined = new Map([...current, ...rules].map((rule) => [rule.string_to_replace, rule]));
    return { value: this.saveRules(dictionary, [...combined.values()]) };
  }

  removeRules(id: string, ruleStrings: string[]): RulesResult {
    const dictionary = this.dictionaries.get(id);
    if (!dictionary) return { missing: true };
    const removed = new Set(ruleStrings);
    const current = dictionary.versions.get(dictionary.metadata.latest_version_id)!;
    return { value: this.saveRules(dictionary, current.filter((rule) => !removed.has(rule.string_to_replace))) };
  }

  private saveRules(dictionary: DictionaryRecord, rules: readonly DictionaryRule[]): RulesVersion {
    const id = dictionary.metadata.id;
    let number = dictionary.versions.size + 1;
    while (dictionary.versions.has(`${id}-v${number}`)) number++;
    const version_id = `${id}-v${number}`;
    dictionary.versions.set(version_id, structuredClone(rules));
    dictionary.metadata.latest_version_id = version_id;
    dictionary.metadata.latest_version_rules_num = rules.length;
    return { id, version_id, version_rules_num: rules.length };
  }

  createDictionary(input: CreateDictionary): CreateResult {
    if (input.rules.some((rule) => rule.string_to_replace.length === 0)) {
      return { error: "Rule string_to_replace must be non-empty" };
    }
    if (!this.creationDefaults) throw new Error("Dictionary creation state is not initialized; run startup or reset");
    let id: string;
    do {
      id = `sim-dictionary-created-${++this.nextDictionaryNumber}`;
    } while (this.dictionaries.has(id));
    const version_id = `${id}-v1`;
    const rules = structuredClone(input.rules);
    const metadata: Metadata = {
      id, name: input.name, description: input.description ?? null,
      created_by: this.creationDefaults.createdBy,
      creation_time_unix: this.creationDefaults.timeUnix + this.nextDictionaryNumber - 1,
      latest_version_id: version_id, latest_version_rules_num: rules.length,
      permission_on_resource: "admin", archived_time_unix: null,
    };
    this.dictionaries.set(id, { metadata, versions: new Map([[version_id, rules]]) });
    return { value: structuredClone({
      id, name: metadata.name, description: metadata.description,
      created_by: metadata.created_by, creation_time_unix: metadata.creation_time_unix,
      version_id, version_rules_num: rules.length,
      permission_on_resource: metadata.permission_on_resource,
    }) };
  }

  getDictionary(id: string) {
    const dictionary = this.dictionaries.get(id);
    if (!dictionary) return undefined;
    return structuredClone({
      ...dictionary.metadata,
      rules: [...dictionary.versions.get(dictionary.metadata.latest_version_id)!],
    });
  }

  listDictionaries(query: HTTP_GET_Query): ListResult {
    const size = query.page_size ?? 30;
    const token = query.cursor ?? "0";
    const offset = Number(token);
    if (!Number.isInteger(size) || size < 1 || size > 100) {
      return { error: "page_size must be an integer from 1 to 100" };
    }
    if (!/^(0|[1-9]\d*)$/.test(token) || !Number.isSafeInteger(offset)) {
      return { error: "cursor must be a nonnegative integer offset" };
    }
    const sort = query.sort ?? "creation_time_unix";
    if (!["creation_time_unix", "name"].includes(sort)) {
      return { error: "sort must be creation_time_unix or name" };
    }
    const direction = (query.sort_direction ?? "descending").toLowerCase();
    if (!["ascending", "descending"].includes(direction)) {
      return { error: "sort_direction must be ascending or descending" };
    }
    const multiplier = direction === "ascending" ? 1 : -1;
    const dictionaries = [...this.dictionaries.values()]
      .map(({ metadata }) => metadata)
      .filter((metadata) => query.include_archived !== false || metadata.archived_time_unix == null)
      .sort((a, b) => multiplier * (
        (sort === "name" ? a.name.localeCompare(b.name) : a.creation_time_unix - b.creation_time_unix)
        || a.id.localeCompare(b.id)
      ));
    const page = structuredClone(dictionaries.slice(offset, offset + size));
    const has_more = offset + page.length < dictionaries.length;
    return { page: {
      pronunciation_dictionaries: page,
      has_more,
      next_cursor: has_more ? String(offset + page.length) : null,
    } };
  }
}

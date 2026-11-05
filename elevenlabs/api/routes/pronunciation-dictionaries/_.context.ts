import type { GetPronunciationDictionaryMetadataResponseModel as Metadata } from "../../types/v1/components/schemas/GetPronunciationDictionaryMetadataResponseModel.js";
import type { GetPronunciationDictionariesMetadataResponseModel as DictionaryPage } from "../../types/v1/components/schemas/GetPronunciationDictionariesMetadataResponseModel.js";
import type { PronunciationDictionaryAliasRuleRequestModel } from "../../types/v1/components/schemas/PronunciationDictionaryAliasRuleRequestModel.js";
import type { PronunciationDictionaryPhonemeRuleRequestModel } from "../../types/v1/components/schemas/PronunciationDictionaryPhonemeRuleRequestModel.js";
import type { HTTP_GET_Query } from "../../types/v1/paths/pronunciation-dictionaries.types.js";

export type DictionaryRule = PronunciationDictionaryAliasRuleRequestModel | PronunciationDictionaryPhonemeRuleRequestModel;
export type DictionaryRecord = {
  metadata: Metadata;
  /** Each version retains its own rules snapshot; later changes add versions. */
  versions: Map<string, readonly DictionaryRule[]>;
};
type ListResult = { page: DictionaryPage; error?: never } | { page?: never; error: string };

export class Context {
  dictionaries = new Map<string, DictionaryRecord>();

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

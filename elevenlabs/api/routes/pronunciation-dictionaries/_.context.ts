import { SaxesParser, type SaxesTagNS } from "saxes";
import { copyUpload } from "../assets/_.context.js";
import type { GetPronunciationDictionaryMetadataResponseModel as Metadata } from "../../types/v1/components/schemas/GetPronunciationDictionaryMetadataResponseModel.js";
import type { GetPronunciationDictionariesMetadataResponseModel as DictionaryPage } from "../../types/v1/components/schemas/GetPronunciationDictionariesMetadataResponseModel.js";
import type { PronunciationDictionaryAliasRuleRequestModel } from "../../types/v1/components/schemas/PronunciationDictionaryAliasRuleRequestModel.js";
import type { PronunciationDictionaryPhonemeRuleRequestModel } from "../../types/v1/components/schemas/PronunciationDictionaryPhonemeRuleRequestModel.js";
import type { HTTP_GET_Query } from "../../types/v1/paths/pronunciation-dictionaries.types.js";
import type { Body_Add_a_pronunciation_dictionary_v1_pronunciation_dictionaries_add_from_rules_post as CreateDictionary } from "../../types/v1/components/schemas/Body_Add_a_pronunciation_dictionary_v1_pronunciation_dictionaries_add_from_rules_post.js";
import type { AddPronunciationDictionaryResponseModel as CreatedDictionary } from "../../types/v1/components/schemas/AddPronunciationDictionaryResponseModel.js";
import type { PronunciationDictionaryRulesResponseModel as RulesVersion } from "../../types/v1/components/schemas/PronunciationDictionaryRulesResponseModel.js";
import type { Body_Update_pronunciation_dictionary_v1_pronunciation_dictionaries__pronunciation_dictionary_id__patch as UpdateDictionary } from "../../types/v1/components/schemas/Body_Update_pronunciation_dictionary_v1_pronunciation_dictionaries__pronunciation_dictionary_id__patch.js";

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
type DownloadResult =
  | { value: string; error?: never; missing?: never }
  | { value?: never; error: string; missing?: never }
  | { value?: never; error?: never; missing: "dictionary" | "version" };

const escapeXml = (value: string) => value.replace(/[&<>"'\r\n\t]/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
  "\r": "&#13;", "\n": "&#10;", "\t": "&#9;",
})[character]!);

export class Context {
  uploadLimits?: { maxBytes: number; maxName: number; maxRules: number };
  dictionaries = new Map<string, DictionaryRecord>();
  nextDictionaryNumber = 0;
  creationDefaults?: { createdBy: string; timeUnix: number };
  archiveTimeUnix?: number;

  createFromFile(input: { name: string; file?: unknown; description?: string | null; workspace_access?: string | null }): CreateResult {
    try {
      const limits = this.uploadLimits;
      if (!limits || typeof input.name !== "string" || !input.name.trim() || input.name.length > limits.maxName
        || input.description != null && typeof input.description !== "string"
        || input.workspace_access != null && !["admin", "editor", "commenter", "viewer"].includes(input.workspace_access)) throw new Error("Invalid dictionary metadata");
      const file = copyUpload(input.file, limits.maxBytes, limits.maxName);
      if (!/\.(pls|xml)$/i.test(file.filename) || !["application/pls+xml", "application/xml", "text/xml", "application/octet-stream"].includes(file.contentType)) throw new Error("Upload a UTF-8 PLS lexicon");
      const xml = new TextDecoder("utf-8", { fatal: true }).decode(file.data);
      type Node = { tag: SaxesTagNS; text: string; children: Node[] };
      const stack: Node[] = [];
      let root: Node | undefined;
      const parser = new SaxesParser({ xmlns: true });
      parser.on("error", (error) => { throw error; });
      parser.on("doctype", () => { throw new Error("DTDs and custom entities are unsupported"); });
      parser.on("processinginstruction", () => { throw new Error("Processing instructions are unsupported"); });
      parser.on("xmldecl", (decl) => { if (decl.encoding && !/^utf-8$/i.test(decl.encoding)) throw new Error("Only UTF-8 XML is supported"); });
      parser.on("opentag", (tag) => {
        if (stack.length >= 3 || tag.uri !== "http://www.w3.org/2005/01/pronunciation-lexicon") throw new Error("Unsupported PLS element");
        const node: Node = { tag, text: "", children: [] };
        if (stack.length) stack.at(-1)!.children.push(node); else root = node;
        stack.push(node);
      });
      const text = (value: string) => { if (stack.length) stack.at(-1)!.text += value; };
      parser.on("text", text); parser.on("cdata", text); parser.on("closetag", () => { stack.pop(); });
      parser.write(xml).close();
      if (!root) throw new Error("Missing lexicon");
      const attributes = (node: Node, allowed: string[]) => {
        for (const attr of Object.values(node.tag.attributes)) if (attr.uri !== "http://www.w3.org/2000/xmlns/" && !allowed.includes(attr.name)) throw new Error("Unsupported PLS attribute");
      };
      attributes(root, ["version", "alphabet", "xml:lang"]);
      if (root.tag.local !== "lexicon" || root.tag.attributes.version?.value !== "1.0" || root.text.trim() || root.children.length > limits.maxRules) throw new Error("Invalid PLS lexicon");
      const rules: DictionaryRule[] = root.children.map((lexeme) => {
        attributes(lexeme, []);
        if (lexeme.tag.local !== "lexeme" || lexeme.text.trim() || lexeme.children.length !== 2) throw new Error("Each lexeme requires one grapheme and pronunciation");
        const [grapheme, pronunciation] = lexeme.children;
        attributes(grapheme, []); attributes(pronunciation, pronunciation.tag.local === "phoneme" ? ["alphabet"] : []);
        if (grapheme.tag.local !== "grapheme" || !grapheme.text || grapheme.children.length || pronunciation.children.length) throw new Error("Invalid PLS rule");
        if (pronunciation.tag.local === "alias") return { type: "alias", string_to_replace: grapheme.text, alias: pronunciation.text };
        const alphabet = pronunciation.tag.attributes.alphabet?.value ?? root!.tag.attributes.alphabet?.value;
        if (pronunciation.tag.local !== "phoneme" || alphabet === undefined) throw new Error("Invalid PLS pronunciation");
        return { type: "phoneme", string_to_replace: grapheme.text, phoneme: pronunciation.text, alphabet };
      });
      return this.createDictionary({ name: input.name, description: input.description, rules, workspace_access: input.workspace_access as CreateDictionary["workspace_access"] });
    } catch { return { error: "Invalid or unsupported UTF-8 PLS upload; DTDs and complex lexemes are unsupported" }; }
  }

  downloadDictionary(id: string, versionId: string): DownloadResult {
    const dictionary = this.dictionaries.get(id);
    if (!dictionary) return { missing: "dictionary" };
    const rules = dictionary.versions.get(versionId);
    if (!rules) return { missing: "version" };
    const text = rules.flatMap((rule) => rule.type === "alias"
      ? [rule.string_to_replace, rule.alias]
      : [rule.string_to_replace, rule.phoneme, rule.alphabet]);
    if (text.some((value) => /[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}]/u.test(value))) {
      return { error: "This version contains characters that XML 1.0 cannot represent" };
    }
    const lexemes = rules.map((rule) => {
      const pronunciation = rule.type === "alias"
        ? `<alias>${escapeXml(rule.alias)}</alias>`
        : `<phoneme alphabet="${escapeXml(rule.alphabet)}">${escapeXml(rule.phoneme)}</phoneme>`;
      return `<lexeme><grapheme>${escapeXml(rule.string_to_replace)}</grapheme>${pronunciation}</lexeme>\n`;
    }).join("");
    return { value: '<?xml version="1.0" encoding="UTF-8"?>\n'
      + '<lexicon version="1.0" xmlns="http://www.w3.org/2005/01/pronunciation-lexicon" alphabet="ipa" xml:lang="en-US">\n'
      + lexemes + '</lexicon>\n' };
  }

  updateDictionary(id: string, input: UpdateDictionary = {}) {
    const dictionary = this.dictionaries.get(id);
    if (!dictionary) return undefined;
    const metadata = dictionary.metadata;
    if (input.archived === true && metadata.archived_time_unix == null && this.archiveTimeUnix === undefined) {
      throw new Error("Dictionary archive state is not initialized; run startup or reset");
    }
    if (input.name !== undefined) metadata.name = input.name;
    if (input.archived === true) metadata.archived_time_unix ??= this.archiveTimeUnix!;
    if (input.archived === false) metadata.archived_time_unix = null;
    return structuredClone(metadata);
  }

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

  setRules(id: string, rules: DictionaryRule[]): RulesResult {
    const dictionary = this.dictionaries.get(id);
    if (!dictionary) return { missing: true };
    if (rules.some((rule) => rule.string_to_replace.length === 0)) {
      return { error: "Rule string_to_replace must be non-empty" };
    }
    return { value: this.saveRules(dictionary, rules) };
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

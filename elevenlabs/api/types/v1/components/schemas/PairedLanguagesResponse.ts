import type { LanguagePairInfo } from "./LanguagePairInfo.js";
/**
 * @example {"kind":"pair","language_pairs":[{"destination_languages":[{"code":"es","label":"Spanish"},{"code":"es-ES","label":"Spanish (Spain)"},{"code":"fr","label":"French"}],"source_language":{"code":"en","label":"English"}},{"destination_languages":[{"code":"en","label":"English"}],"source_language":{"code":"es-ES","label":"Spanish (Spain)"}}]}
 */
export type PairedLanguagesResponse = {
  /**
   * Indicates this response contains source-to-destination language pairs.
   * @default "pair"
   */
  kind?: "pair";
  /**
   * The list of available source-to-destination language mappings.
   */
  language_pairs: Array<LanguagePairInfo>;
};

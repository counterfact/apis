import type { LanguageInfo } from "./LanguageInfo.js";
/**
 * @example {"destination_languages":[{"code":"es-ES","label":"Spanish (Spain)"},{"code":"fr","label":"French"}],"source_language":{"code":"en","label":"English"}}
 */
export type LanguagePairInfo = {
  /**
   * The source language.
   */
  source_language: LanguageInfo;
  /**
   * The available destination languages for this source language.
   */
  destination_languages: Array<LanguageInfo>;
};

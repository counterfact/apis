import type { LanguageInfo } from "./LanguageInfo.js";
/**
 * @example {"kind":"single","languages":[{"code":"en","label":"English"},{"code":"es-ES","label":"Spanish (Spain)"},{"code":"fr","label":"French"}]}
 */
export type SingleLanguagesResponse = {
  /**
   * Indicates this response contains single languages (not source-to-destination pairs).
   * @default "single"
   */
  kind?: "single";
  /**
   * The list of available languages.
   */
  languages: Array<LanguageInfo>;
};

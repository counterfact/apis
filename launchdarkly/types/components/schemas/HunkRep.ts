export type HunkRep = {
  /**
   * Line number of beginning of code reference hunk
   * @example 45
   */
  startingLineNumber: number;
  /**
   * Contextual lines of code that include the referenced feature flag
   * @example "var enableFeature = 'enable-feature';"
   */
  lines?: string;
  /**
   * The project key
   * @example "default"
   */
  projKey?: string;
  /**
   * The feature flag key
   * @example "enable-feature"
   */
  flagKey?: string;
  /**
   * An array of flag key aliases
   * @example ["enableFeature","EnableFeature"]
   */
  aliases?: Array<string>;
};

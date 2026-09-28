export type CopiedFromEnv = {
  /**
   * Key of feature flag copied
   * @example "source-flag-key-123abc"
   */
  key: string;
  /**
   * Version of feature flag copied
   * @example 1
   */
  version?: number;
};

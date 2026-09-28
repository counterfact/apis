export type SourceEnv = {
  /**
   * The key of the source environment to clone from
   */
  key?: string;
  /**
   * (Optional) The version number of the source environment to clone from. Used for optimistic locking
   */
  version?: number;
};

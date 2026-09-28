export type sourceFlag = {
  /**
   * The environment key for the source environment
   * @example "environment-key-123abc"
   */
  key: string;
  /**
   * The version of the source flag from which to copy
   * @example 1
   */
  version?: number;
};

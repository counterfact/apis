export type instructionUserRequest = {
  /**
   * The type of change to make to the removal date for this user from individual targeting for this flag.
   * @example "addExpireUserTargetDate"
   */
  kind:
    | "addExpireUserTargetDate"
    | "updateExpireUserTargetDate"
    | "removeExpireUserTargetDate";
  /**
   * The flag key
   * @example "sample-flag-key"
   */
  flagKey: string;
  /**
   * ID of a variation on the flag
   * @example "ce12d345-a1b2-4fb5-a123-ab123d4d5f5d"
   */
  variationId: string;
  /**
   * The time, in Unix milliseconds, when LaunchDarkly should remove the user from individual targeting for this flag. Required if <code>kind</code> is <code>addExpireUserTargetDate</code> or <code>updateExpireUserTargetDate</code>.
   * @example 1653469200000
   */
  value?: number;
  /**
   * The version of the expiring user target to update. Optional and only used if <code>kind</code> is <code>updateExpireUserTargetDate</code>. If included, update will fail if version doesn't match current version of the expiring user target.
   * @example 1
   */
  version?: number;
};

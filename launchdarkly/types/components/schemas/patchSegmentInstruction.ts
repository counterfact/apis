export type patchSegmentInstruction = {
  /**
   * The type of change to make to the user's removal date from this segment
   * @example "addExpireUserTargetDate"
   */
  kind:
    | "addExpireUserTargetDate"
    | "updateExpireUserTargetDate"
    | "removeExpireUserTargetDate";
  /**
   * A unique key used to represent the user
   */
  userKey: string;
  /**
   * The segment's target type
   */
  targetType: "included" | "excluded";
  /**
   * The time, in Unix milliseconds, when the user should be removed from this segment. Required if <code>kind</code> is <code>addExpireUserTargetDate</code> or <code>updateExpireUserTargetDate</code>.
   * @example 1653469200000
   */
  value?: number;
  /**
   * The version of the segment to update. Required if <code>kind</code> is <code>updateExpireUserTargetDate</code>.
   * @example 1
   */
  version?: number;
};

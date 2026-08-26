export type patchSegmentExpiringTargetInstruction = {
  /**
   * The type of change to make to the context's removal date from this segment
   * @example "addExpiringTarget"
   */
  kind: "addExpiringTarget" | "updateExpiringTarget" | "removeExpiringTarget";
  /**
   * A unique key used to represent the context
   */
  contextKey: string;
  /**
   * The kind of context
   * @example "user"
   */
  contextKind: string;
  /**
   * The segment's target type
   */
  targetType: "included" | "excluded";
  /**
   * The time, in Unix milliseconds, when the context should be removed from this segment. Required if <code>kind</code> is <code>addExpiringTarget</code> or <code>updateExpiringTarget</code>.
   * @example 1653469200000
   */
  value?: number;
  /**
   * The version of the expiring target to update. Optional and only used if <code>kind</code> is <code>updateExpiringTarget</code>. If included, update will fail if version doesn't match current version of the expiring target.
   * @example 1
   */
  version?: number;
};

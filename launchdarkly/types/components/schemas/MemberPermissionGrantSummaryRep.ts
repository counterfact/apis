export type MemberPermissionGrantSummaryRep = {
  /**
   * The name of the group of related actions to allow. A permission grant may have either an <code>actionSet</code> or a list of <code>actions</code> but not both at the same time.
   */
  actionSet?: string;
  /**
   * A list of actions to allow. A permission grant may have either an <code>actionSet</code> or a list of <code>actions</code> but not both at the same time.
   * @example ["maintainTeam"]
   */
  actions?: Array<string>;
  /**
   * The resource for which the actions are allowed
   * @example "team/qa-team"
   */
  resource: string;
};

export type permissionGrantInput = {
  /**
   * A group of related actions to allow. Specify either <code>actionSet</code> or <code>actions</code>. Use <code>maintainTeam</code> to add team maintainers.
   * @example "maintainTeam"
   */
  actionSet?: "maintainTeam";
  /**
   * A list of actions to allow. Specify either <code>actionSet</code> or <code>actions</code>. To learn more, read [Role actions](https://docs.launchdarkly.com/home/account/role-actions).
   * @example ["updateTeamMembers"]
   */
  actions?: Array<string>;
  /**
   * A list of member IDs who receive the permission grant.
   * @example ["12ab3c45de678910fgh12345"]
   */
  memberIDs?: Array<string>;
};

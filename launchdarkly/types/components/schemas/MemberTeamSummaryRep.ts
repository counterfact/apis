export type MemberTeamSummaryRep = {
  /**
   * A list of keys of the custom roles this team has access to
   * @example ["access-to-test-projects"]
   */
  customRoleKeys: Array<string>;
  /**
   * The team key
   * @example "team-key-123abc"
   */
  key: string;
  _links?: { [key: string]: unknown };
  /**
   * The team name
   * @example "QA Team"
   */
  name: string;
};

/**
 * Team Membership
 */
export type team_membership = {
  /**
   * @format uri
   */
  url: string;
  /**
   * The role of the user in the team.
   * @default "member"
   * @example "member"
   */
  role: "member" | "maintainer";
  /**
   * The state of the user's membership in the team.
   */
  state: "active" | "pending";
};

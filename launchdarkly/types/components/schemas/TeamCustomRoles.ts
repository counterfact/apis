import type { TeamCustomRole } from "./TeamCustomRole.js";

export type TeamCustomRoles = {
  /**
   * The number of custom roles assigned to this team
   * @example 1
   */
  totalCount?: number;
  /**
   * An array of the custom roles that have been assigned to this team
   */
  items?: Array<TeamCustomRole>;
  /**
   * The location and content type of related resources
   * @example {"self":{"href":"/api/v2/teams/example-team/roles?limit=25","type":"application/json"}}
   */
  _links?: { [key: string]: unknown };
};

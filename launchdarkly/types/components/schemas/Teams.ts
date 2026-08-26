import type { Team } from "./Team.js";

export type Teams = {
  /**
   * An array of teams
   */
  items?: Array<Team>;
  /**
   * The location and content type of related resources
   * @example {"self":{"href":"/api/v2/teams?expand=maintainers%2Cmembers%2Croles%2Cprojects&limit=20","type":"application/json"}}
   */
  _links?: { [key: string]: unknown };
  /**
   * The number of teams
   * @example 1
   */
  totalCount?: number;
};

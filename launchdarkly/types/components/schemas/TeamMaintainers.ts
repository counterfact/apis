import type { MemberSummary } from "./MemberSummary.js";

export type TeamMaintainers = {
  /**
   * The number of maintainers of the team
   * @example 1
   */
  totalCount?: number;
  /**
   * Details on the members that have been assigned as maintainers of the team
   * @example [{"_id":"569f183514f4432160000007","_links":{"self":{"href":"/api/v2/members/569f183514f4432160000007","type":"application/json"}},"email":"ariel@acme.com","firstName":"Ariel","lastName":"Flores","role":"reader"}]
   */
  items?: Array<MemberSummary>;
  /**
   * The location and content type of related resources
   * @example {"self":{"href":"/api/v2/teams/example-team/maintainers?limit=5","type":"application/json"}}
   */
  _links?: { [key: string]: unknown };
};

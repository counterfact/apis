import type { FollowFlagMember } from "./FollowFlagMember.js";

export type FlagFollowersGetRep = {
  /**
   * The location and content type of related resources
   * @example {"self":{"href":"/api/v2/projects/my-project/flags/my-flay/environments/my-environment/followers","type":"application/json"}}
   */
  _links: { [key: string]: unknown };
  /**
   * An array of members who are following this flag
   */
  items: Array<FollowFlagMember>;
};

import type { followersPerFlag } from "./followersPerFlag.js";

export type FlagFollowersByProjEnvGetRep = {
  /**
   * The location and content type of related resources
   * @example {"self":{"href":"/api/v2/projects/my-project/flags/my-flay/environments/my-environment/followers","type":"application/json"}}
   */
  _links: { [key: string]: unknown };
  /**
   * An array of flags and their followers
   */
  items?: Array<followersPerFlag>;
};

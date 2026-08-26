import type { FollowFlagMember } from "./FollowFlagMember.js";

export type followersPerFlag = {
  /**
   * The flag key
   * @example "example-flag-key"
   */
  flagKey?: string;
  /**
   * A list of members who are following this flag
   */
  followers?: Array<FollowFlagMember>;
};

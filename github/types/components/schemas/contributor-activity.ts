import type { nullable_simple_user } from "./nullable-simple-user.js";

/**
 * Contributor Activity
 */
export type contributor_activity = {
  author: nullable_simple_user;
  /**
   * @example 135
   */
  total: number;
  /**
   * @example [{"w":"1367712000","a":6898,"d":77,"c":10}]
   */
  weeks: Array<{ w?: number; a?: number; d?: number; c?: number }>;
};

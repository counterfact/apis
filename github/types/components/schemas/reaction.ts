import type { nullable_simple_user } from "./nullable-simple-user.js";

/**
 * Reactions to conversations provide a way to help people express their feelings more simply and effectively.
 */
export type reaction = {
  /**
   * @example 1
   */
  id: number;
  /**
   * @example "MDg6UmVhY3Rpb24x"
   */
  node_id: string;
  user: nullable_simple_user;
  /**
   * The reaction to use
   * @example "heart"
   */
  content:
    | "+1"
    | "-1"
    | "laugh"
    | "confused"
    | "heart"
    | "hooray"
    | "rocket"
    | "eyes";
  /**
   * @format date-time
   * @example "2016-05-20T20:09:31Z"
   */
  created_at: string;
};

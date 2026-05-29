import type { nullable_simple_user } from "./nullable-simple-user.js";

/**
 * Stargazer
 */
export type stargazer = {
  /**
   * @format date-time
   */
  starred_at: string;
  user: nullable_simple_user;
};

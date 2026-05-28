import type { nullable_simple_user } from "./nullable-simple-user.js";

/**
 * Context around who pinned an issue comment and when it was pinned.
 */
export type nullable_pinned_issue_comment = {
  /**
   * @format date-time
   * @example "2011-04-14T16:00:49Z"
   */
  pinned_at: string;
  pinned_by: nullable_simple_user;
};

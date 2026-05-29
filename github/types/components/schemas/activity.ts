import type { nullable_simple_user } from "./nullable-simple-user.js";

/**
 * Activity
 */
export type activity = {
  /**
   * @example 1296269
   */
  id: number;
  /**
   * @example "MDEwOlJlcG9zaXRvcnkxMjk2MjY5"
   */
  node_id: string;
  /**
   * The SHA of the commit before the activity.
   * @example "6dcb09b5b57875f334f61aebed695e2e4193db5e"
   */
  before: string;
  /**
   * The SHA of the commit after the activity.
   * @example "827efc6d56897b048c772eb4087f854f46256132"
   */
  after: string;
  /**
   * The full Git reference, formatted as `refs/heads/<branch name>`.
   * @example "refs/heads/main"
   */
  ref: string;
  /**
   * The time when the activity occurred.
   * @format date-time
   * @example "2011-01-26T19:06:43Z"
   */
  timestamp: string;
  /**
   * The type of the activity that was performed.
   * @example "force_push"
   */
  activity_type:
    | "push"
    | "force_push"
    | "branch_deletion"
    | "branch_creation"
    | "pr_merge"
    | "merge_queue_merge";
  actor: nullable_simple_user;
};

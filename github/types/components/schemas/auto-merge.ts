import type { simple_user } from "./simple-user.js";

/**
 * The status of auto merging a pull request.
 */
export type auto_merge = {
  enabled_by: simple_user;
  /**
   * The merge method to use.
   */
  merge_method: "merge" | "squash" | "rebase";
  /**
   * Title for the merge commit message.
   */
  commit_title: string;
  /**
   * Commit message for the merge commit.
   */
  commit_message: string;
};

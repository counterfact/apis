import type { nullable_simple_user } from "./nullable-simple-user.js";

/**
 * Gist Commit
 */
export type gist_commit = {
  /**
   * @format uri
   * @example "https://api.github.com/gists/aa5a315d61ae9438b18d/57a7f021a713b1c5a6a199b54cc514735d2d462f"
   */
  url: string;
  /**
   * @example "57a7f021a713b1c5a6a199b54cc514735d2d462f"
   */
  version: string;
  user: nullable_simple_user;
  change_status: { total?: number; additions?: number; deletions?: number };
  /**
   * @format date-time
   * @example "2010-04-14T02:15:15Z"
   */
  committed_at: string;
};

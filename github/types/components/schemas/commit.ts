import type { nullable_git_user } from "./nullable-git-user.js";
import type { verification } from "./verification.js";
import type { simple_user } from "./simple-user.js";
import type { empty_object } from "./empty-object.js";
import type { diff_entry } from "./diff-entry.js";

/**
 * Commit
 */
export type commit = {
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e"
   */
  url: string;
  /**
   * @example "6dcb09b5b57875f334f61aebed695e2e4193db5e"
   */
  sha: string;
  /**
   * @example "MDY6Q29tbWl0NmRjYjA5YjViNTc4NzVmMzM0ZjYxYWViZWQ2OTVlMmU0MTkzZGI1ZQ=="
   */
  node_id: string;
  /**
   * @format uri
   * @example "https://github.com/octocat/Hello-World/commit/6dcb09b5b57875f334f61aebed695e2e4193db5e"
   */
  html_url: string;
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e/comments"
   */
  comments_url: string;
  commit: {
    /**
     * @format uri
     * @example "https://api.github.com/repos/octocat/Hello-World/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e"
     */
    url: string;
    author: nullable_git_user;
    committer: nullable_git_user;
    /**
     * @example "Fix all the bugs"
     */
    message: string;
    /**
     * @example 0
     */
    comment_count: number;
    tree: {
      /**
       * @example "827efc6d56897b048c772eb4087f854f46256132"
       */
      sha: string;
      /**
       * @format uri
       * @example "https://api.github.com/repos/octocat/Hello-World/tree/827efc6d56897b048c772eb4087f854f46256132"
       */
      url: string;
    };
    verification?: verification;
  };
  author: simple_user | empty_object;
  committer: simple_user | empty_object;
  parents: Array<{
    /**
     * @example "7638417db6d59f3c431d3e1f261cc637155684cd"
     */
    sha: string;
    /**
     * @format uri
     * @example "https://api.github.com/repos/octocat/Hello-World/commits/7638417db6d59f3c431d3e1f261cc637155684cd"
     */
    url: string;
    /**
     * @format uri
     * @example "https://github.com/octocat/Hello-World/commit/7638417db6d59f3c431d3e1f261cc637155684cd"
     */
    html_url?: string;
  }>;
  stats?: { additions?: number; deletions?: number; total?: number };
  files?: Array<diff_entry>;
};

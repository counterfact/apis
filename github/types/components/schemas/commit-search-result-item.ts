import type { nullable_git_user } from "./nullable-git-user.js";
import type { verification } from "./verification.js";
import type { nullable_simple_user } from "./nullable-simple-user.js";
import type { minimal_repository } from "./minimal-repository.js";
import type { search_result_text_matches } from "./search-result-text-matches.js";

/**
 * Commit Search Result Item
 */
export type commit_search_result_item = {
  /**
   * @format uri
   */
  url: string;
  sha: string;
  /**
   * @format uri
   */
  html_url: string;
  /**
   * @format uri
   */
  comments_url: string;
  commit: {
    author: {
      name: string;
      email: string;
      /**
       * @format date-time
       */
      date: string;
    };
    committer: nullable_git_user;
    comment_count: number;
    message: string;
    tree: {
      sha: string;
      /**
       * @format uri
       */
      url: string;
    };
    /**
     * @format uri
     */
    url: string;
    verification?: verification;
  };
  author: nullable_simple_user;
  committer: nullable_git_user;
  parents: Array<{ url?: string; html_url?: string; sha?: string }>;
  repository: minimal_repository;
  score: number;
  node_id: string;
  text_matches?: search_result_text_matches;
};

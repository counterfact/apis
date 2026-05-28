import type { commit } from "./commit.js";
import type { diff_entry } from "./diff-entry.js";

/**
 * Commit Comparison
 */
export type commit_comparison = {
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/compare/master...topic"
   */
  url: string;
  /**
   * @format uri
   * @example "https://github.com/octocat/Hello-World/compare/master...topic"
   */
  html_url: string;
  /**
   * @format uri
   * @example "https://github.com/octocat/Hello-World/compare/octocat:bbcd538c8e72b8c175046e27cc8f907076331401...octocat:0328041d1152db8ae77652d1618a02e57f745f17"
   */
  permalink_url: string;
  /**
   * @format uri
   * @example "https://github.com/octocat/Hello-World/compare/master...topic.diff"
   */
  diff_url: string;
  /**
   * @format uri
   * @example "https://github.com/octocat/Hello-World/compare/master...topic.patch"
   */
  patch_url: string;
  base_commit: commit;
  merge_base_commit: commit;
  /**
   * @example "ahead"
   */
  status: "diverged" | "ahead" | "behind" | "identical";
  /**
   * @example 4
   */
  ahead_by: number;
  /**
   * @example 5
   */
  behind_by: number;
  /**
   * @example 6
   */
  total_commits: number;
  commits: Array<commit>;
  files?: Array<diff_entry>;
};

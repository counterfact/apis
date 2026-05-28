import type { simple_user } from "./simple-user.js";
import type { nullable_milestone } from "./nullable-milestone.js";
import type { nullable_simple_user } from "./nullable-simple-user.js";
import type { team_simple } from "./team-simple.js";
import type { repository } from "./repository.js";
import type { link } from "./link.js";
import type { author_association } from "./author-association.js";
import type { auto_merge } from "./auto-merge.js";

/**
 * Pull requests let you tell others about changes you've pushed to a repository on GitHub. Once a pull request is sent, interested parties can review the set of changes, discuss potential modifications, and even push follow-up commits if necessary.
 */
export type pull_request = {
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/pulls/1347"
   */
  url: string;
  /**
   * @format int64
   * @example 1
   */
  id: number;
  /**
   * @example "MDExOlB1bGxSZXF1ZXN0MQ=="
   */
  node_id: string;
  /**
   * @format uri
   * @example "https://github.com/octocat/Hello-World/pull/1347"
   */
  html_url: string;
  /**
   * @format uri
   * @example "https://github.com/octocat/Hello-World/pull/1347.diff"
   */
  diff_url: string;
  /**
   * @format uri
   * @example "https://github.com/octocat/Hello-World/pull/1347.patch"
   */
  patch_url: string;
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/issues/1347"
   */
  issue_url: string;
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/pulls/1347/commits"
   */
  commits_url: string;
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/pulls/1347/comments"
   */
  review_comments_url: string;
  /**
   * @example "https://api.github.com/repos/octocat/Hello-World/pulls/comments{/number}"
   */
  review_comment_url: string;
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/issues/1347/comments"
   */
  comments_url: string;
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/statuses/6dcb09b5b57875f334f61aebed695e2e4193db5e"
   */
  statuses_url: string;
  /**
   * Number uniquely identifying the pull request within its repository.
   * @example 42
   */
  number: number;
  /**
   * State of this Pull Request. Either `open` or `closed`.
   * @example "open"
   */
  state: "open" | "closed";
  /**
   * @example true
   */
  locked: boolean;
  /**
   * The title of the pull request.
   * @example "Amazing new feature"
   */
  title: string;
  user: simple_user;
  /**
   * @example "Please pull these awesome changes"
   */
  body: string;
  labels: Array<{
    /**
     * @format int64
     */
    id: number;
    node_id: string;
    url: string;
    name: string;
    description: string;
    color: string;
    default: boolean;
  }>;
  milestone: nullable_milestone;
  /**
   * @example "too heated"
   */
  active_lock_reason?: string;
  /**
   * @format date-time
   * @example "2011-01-26T19:01:12Z"
   */
  created_at: string;
  /**
   * @format date-time
   * @example "2011-01-26T19:01:12Z"
   */
  updated_at: string;
  /**
   * @format date-time
   * @example "2011-01-26T19:01:12Z"
   */
  closed_at: string;
  /**
   * @format date-time
   * @example "2011-01-26T19:01:12Z"
   */
  merged_at: string;
  /**
   * @example "e5bd3914e2e596debea16f433f57875b5b90bcd6"
   */
  merge_commit_sha: string;
  assignee: nullable_simple_user;
  assignees?: Array<simple_user>;
  requested_reviewers?: Array<simple_user>;
  requested_teams?: Array<team_simple>;
  head: {
    label: string;
    ref: string;
    repo: repository;
    sha: string;
    user: simple_user;
  };
  base: {
    label: string;
    ref: string;
    repo: repository;
    sha: string;
    user: simple_user;
  };
  _links: {
    comments: link;
    commits: link;
    statuses: link;
    html: link;
    issue: link;
    review_comments: link;
    review_comment: link;
    self: link;
  };
  author_association: author_association;
  auto_merge: auto_merge;
  /**
   * Indicates whether or not the pull request is a draft.
   * @example false
   */
  draft?: boolean;
  merged: boolean;
  /**
   * @example true
   */
  mergeable: boolean;
  /**
   * @example true
   */
  rebaseable?: boolean;
  /**
   * @example "clean"
   */
  mergeable_state: string;
  merged_by: nullable_simple_user;
  /**
   * @example 10
   */
  comments: number;
  /**
   * @example 0
   */
  review_comments: number;
  /**
   * Indicates whether maintainers can modify the pull request.
   * @example true
   */
  maintainer_can_modify: boolean;
  /**
   * @example 3
   */
  commits: number;
  /**
   * @example 100
   */
  additions: number;
  /**
   * @example 3
   */
  deletions: number;
  /**
   * @example 5
   */
  changed_files: number;
};

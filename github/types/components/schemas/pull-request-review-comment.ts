import type { nullable_simple_user } from "./nullable-simple-user.js";
import type { author_association } from "./author-association.js";
import type { reaction_rollup } from "./reaction-rollup.js";

/**
 * Pull Request Review Comments are comments on a portion of the Pull Request's diff.
 */
export type pull_request_review_comment = {
  /**
   * URL for the pull request review comment
   * @example "https://api.github.com/repos/octocat/Hello-World/pulls/comments/1"
   */
  url: string;
  /**
   * The ID of the pull request review to which the comment belongs.
   * @format int64
   * @example 42
   */
  pull_request_review_id: number;
  /**
   * The ID of the pull request review comment.
   * @format int64
   * @example 1
   */
  id: number;
  /**
   * The node ID of the pull request review comment.
   * @example "MDI0OlB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudDEw"
   */
  node_id: string;
  /**
   * The diff of the line that the comment refers to.
   * @example "@@ -16,33 +16,40 @@ public class Connection : IConnection..."
   */
  diff_hunk: string;
  /**
   * The relative path of the file to which the comment applies.
   * @example "config/database.yaml"
   */
  path: string;
  /**
   * The line index in the diff to which the comment applies. This field is closing down; use `line` instead.
   * @example 1
   */
  position?: number;
  /**
   * The index of the original line in the diff to which the comment applies. This field is closing down; use `original_line` instead.
   * @example 4
   */
  original_position?: number;
  /**
   * The SHA of the commit to which the comment applies.
   * @example "6dcb09b5b57875f334f61aebed695e2e4193db5e"
   */
  commit_id: string;
  /**
   * The SHA of the original commit to which the comment applies.
   * @example "9c48853fa3dc5c1c3d6f1f1cd1f2743e72652840"
   */
  original_commit_id: string;
  /**
   * The comment ID to reply to.
   * @example 8
   */
  in_reply_to_id?: number;
  user: nullable_simple_user;
  /**
   * The text of the comment.
   * @example "We should probably include a check for null values here."
   */
  body: string;
  /**
   * @format date-time
   * @example "2011-04-14T16:00:49Z"
   */
  created_at: string;
  /**
   * @format date-time
   * @example "2011-04-14T16:00:49Z"
   */
  updated_at: string;
  /**
   * HTML URL for the pull request review comment.
   * @format uri
   * @example "https://github.com/octocat/Hello-World/pull/1#discussion-diff-1"
   */
  html_url: string;
  /**
   * URL for the pull request that the review comment belongs to.
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/pulls/1"
   */
  pull_request_url: string;
  author_association: author_association;
  _links: {
    self: {
      /**
       * @format uri
       * @example "https://api.github.com/repos/octocat/Hello-World/pulls/comments/1"
       */
      href: string;
    };
    html: {
      /**
       * @format uri
       * @example "https://github.com/octocat/Hello-World/pull/1#discussion-diff-1"
       */
      href: string;
    };
    pull_request: {
      /**
       * @format uri
       * @example "https://api.github.com/repos/octocat/Hello-World/pulls/1"
       */
      href: string;
    };
  };
  /**
   * The first line of the range for a multi-line comment.
   * @example 2
   */
  start_line?: number;
  /**
   * The first line of the range for a multi-line comment.
   * @example 2
   */
  original_start_line?: number;
  /**
   * The side of the first line of the range for a multi-line comment.
   * @default "RIGHT"
   */
  start_side?: "LEFT" | "RIGHT";
  /**
   * The line of the blob to which the comment applies. The last line of the range for a multi-line comment
   * @example 2
   */
  line?: number;
  /**
   * The line of the blob to which the comment applies. The last line of the range for a multi-line comment
   * @example 2
   */
  original_line?: number;
  /**
   * The side of the diff to which the comment applies. The side of the last line of the range for a multi-line comment
   * @default "RIGHT"
   */
  side?: "LEFT" | "RIGHT";
  /**
   * The level at which the comment is targeted, can be a diff line or a file.
   */
  subject_type?: "line" | "file";
  reactions?: reaction_rollup;
  /**
   * @example "\"<p>comment body</p>\""
   */
  body_html?: string;
  /**
   * @example "\"comment body\""
   */
  body_text?: string;
};

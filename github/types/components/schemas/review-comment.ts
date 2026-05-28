import type { nullable_simple_user } from "./nullable-simple-user.js";
import type { author_association } from "./author-association.js";
import type { link } from "./link.js";
import type { reaction_rollup } from "./reaction-rollup.js";

/**
 * Legacy Review Comment
 */
export type review_comment = {
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/pulls/comments/1"
   */
  url: string;
  /**
   * @format int64
   * @example 42
   */
  pull_request_review_id: number;
  /**
   * @format int64
   * @example 10
   */
  id: number;
  /**
   * @example "MDI0OlB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudDEw"
   */
  node_id: string;
  /**
   * @example "@@ -16,33 +16,40 @@ public class Connection : IConnection..."
   */
  diff_hunk: string;
  /**
   * @example "file1.txt"
   */
  path: string;
  /**
   * @example 1
   */
  position: number;
  /**
   * @example 4
   */
  original_position: number;
  /**
   * @example "6dcb09b5b57875f334f61aebed695e2e4193db5e"
   */
  commit_id: string;
  /**
   * @example "9c48853fa3dc5c1c3d6f1f1cd1f2743e72652840"
   */
  original_commit_id: string;
  /**
   * @example 8
   */
  in_reply_to_id?: number;
  user: nullable_simple_user;
  /**
   * @example "Great stuff"
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
   * @format uri
   * @example "https://github.com/octocat/Hello-World/pull/1#discussion-diff-1"
   */
  html_url: string;
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/pulls/1"
   */
  pull_request_url: string;
  author_association: author_association;
  _links: { self: link; html: link; pull_request: link };
  body_text?: string;
  body_html?: string;
  reactions?: reaction_rollup;
  /**
   * The side of the first line of the range for a multi-line comment.
   * @default "RIGHT"
   */
  side?: "LEFT" | "RIGHT";
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
   * The original line of the blob to which the comment applies. The last line of the range for a multi-line comment
   * @example 2
   */
  original_line?: number;
  /**
   * The first line of the range for a multi-line comment.
   * @example 2
   */
  start_line?: number;
  /**
   * The original first line of the range for a multi-line comment.
   * @example 2
   */
  original_start_line?: number;
  /**
   * The level at which the comment is targeted, can be a diff line or a file.
   */
  subject_type?: "line" | "file";
};

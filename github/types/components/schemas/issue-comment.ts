import type { nullable_simple_user } from "./nullable-simple-user.js";
import type { author_association } from "./author-association.js";
import type { nullable_integration } from "./nullable-integration.js";
import type { reaction_rollup } from "./reaction-rollup.js";
import type { nullable_pinned_issue_comment } from "./nullable-pinned-issue-comment.js";

/**
 * Comments provide a way for people to collaborate on an issue.
 */
export type issue_comment = {
  /**
   * Unique identifier of the issue comment
   * @format int64
   * @example 42
   */
  id: number;
  node_id: string;
  /**
   * URL for the issue comment
   * @format uri
   * @example "https://api.github.com/repositories/42/issues/comments/1"
   */
  url: string;
  /**
   * Contents of the issue comment
   * @example "What version of Safari were you using when you observed this bug?"
   */
  body?: string;
  body_text?: string;
  body_html?: string;
  /**
   * @format uri
   */
  html_url: string;
  user: nullable_simple_user;
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
   */
  issue_url: string;
  author_association?: author_association;
  performed_via_github_app?: nullable_integration;
  reactions?: reaction_rollup;
  pin?: nullable_pinned_issue_comment;
};

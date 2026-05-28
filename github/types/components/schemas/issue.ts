import type { nullable_simple_user } from "./nullable-simple-user.js";
import type { simple_user } from "./simple-user.js";
import type { nullable_milestone } from "./nullable-milestone.js";
import type { issue_type } from "./issue-type.js";
import type { repository } from "./repository.js";
import type { nullable_integration } from "./nullable-integration.js";
import type { author_association } from "./author-association.js";
import type { reaction_rollup } from "./reaction-rollup.js";
import type { sub_issues_summary } from "./sub-issues-summary.js";
import type { nullable_issue_comment } from "./nullable-issue-comment.js";
import type { issue_dependencies_summary } from "./issue-dependencies-summary.js";
import type { issue_field_value } from "./issue-field-value.js";

/**
 * Issues are a great way to keep track of tasks, enhancements, and bugs for your projects.
 */
export type issue = {
  /**
   * @format int64
   */
  id: number;
  node_id: string;
  /**
   * URL for the issue
   * @format uri
   * @example "https://api.github.com/repositories/42/issues/1"
   */
  url: string;
  /**
   * @format uri
   */
  repository_url: string;
  labels_url: string;
  /**
   * @format uri
   */
  comments_url: string;
  /**
   * @format uri
   */
  events_url: string;
  /**
   * @format uri
   */
  html_url: string;
  /**
   * Number uniquely identifying the issue within its repository
   * @example 42
   */
  number: number;
  /**
   * State of the issue; either 'open' or 'closed'
   * @example "open"
   */
  state: string;
  /**
   * The reason for the current state
   * @example "not_planned"
   */
  state_reason?: "completed" | "reopened" | "not_planned" | "duplicate";
  /**
   * Title of the issue
   * @example "Widget creation fails in Safari on OS X 10.8"
   */
  title: string;
  /**
   * Contents of the issue
   * @example "It looks like the new widget form is broken on Safari. When I try and create the widget, Safari crashes. This is reproducible on 10.8, but not 10.9. Maybe a browser bug?"
   */
  body?: string;
  user: nullable_simple_user;
  /**
   * Labels to associate with this issue; pass one or more label names to replace the set of labels on this issue; send an empty array to clear all labels from the issue; note that the labels are silently dropped for users without push access to the repository
   * @example ["bug","registration"]
   */
  labels: Array<
    | string
    | {
        /**
         * @format int64
         */
        id?: number;
        node_id?: string;
        /**
         * @format uri
         */
        url?: string;
        name?: string;
        description?: string;
        color?: string;
        default?: boolean;
      }
  >;
  assignee: nullable_simple_user;
  assignees?: Array<simple_user>;
  milestone: nullable_milestone;
  locked: boolean;
  active_lock_reason?: string;
  comments: number;
  pull_request?: {
    /**
     * @format date-time
     */
    merged_at?: string;
    /**
     * @format uri
     */
    diff_url: string;
    /**
     * @format uri
     */
    html_url: string;
    /**
     * @format uri
     */
    patch_url: string;
    /**
     * @format uri
     */
    url: string;
  };
  /**
   * @format date-time
   */
  closed_at: string;
  /**
   * @format date-time
   */
  created_at: string;
  /**
   * @format date-time
   */
  updated_at: string;
  draft?: boolean;
  closed_by?: nullable_simple_user;
  body_html?: string;
  body_text?: string;
  /**
   * @format uri
   */
  timeline_url?: string;
  type?: issue_type;
  repository?: repository;
  performed_via_github_app?: nullable_integration;
  author_association?: author_association;
  reactions?: reaction_rollup;
  sub_issues_summary?: sub_issues_summary;
  /**
   * URL to get the parent issue of this issue, if it is a sub-issue
   * @format uri
   */
  parent_issue_url?: string;
  pinned_comment?: nullable_issue_comment;
  issue_dependencies_summary?: issue_dependencies_summary;
  issue_field_values?: Array<issue_field_value>;
};

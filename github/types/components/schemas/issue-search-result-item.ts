import type { simple_user } from "./simple-user.js";
import type { nullable_simple_user } from "./nullable-simple-user.js";
import type { sub_issues_summary } from "./sub-issues-summary.js";
import type { issue_dependencies_summary } from "./issue-dependencies-summary.js";
import type { issue_field_value } from "./issue-field-value.js";
import type { nullable_milestone } from "./nullable-milestone.js";
import type { search_result_text_matches } from "./search-result-text-matches.js";
import type { author_association } from "./author-association.js";
import type { repository } from "./repository.js";
import type { issue_type } from "./issue-type.js";
import type { nullable_integration } from "./nullable-integration.js";
import type { nullable_issue_comment } from "./nullable-issue-comment.js";
import type { reaction_rollup } from "./reaction-rollup.js";

/**
 * Issue Search Result Item
 */
export type issue_search_result_item = {
  /**
   * @format uri
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
   * @format int64
   */
  id: number;
  node_id: string;
  number: number;
  title: string;
  locked: boolean;
  active_lock_reason?: string;
  assignees?: Array<simple_user>;
  user: nullable_simple_user;
  labels: Array<{
    /**
     * @format int64
     */
    id?: number;
    node_id?: string;
    url?: string;
    name?: string;
    color?: string;
    default?: boolean;
    description?: string;
  }>;
  sub_issues_summary?: sub_issues_summary;
  issue_dependencies_summary?: issue_dependencies_summary;
  issue_field_values?: Array<issue_field_value>;
  state: string;
  state_reason?: string;
  assignee: nullable_simple_user;
  milestone: nullable_milestone;
  comments: number;
  /**
   * @format date-time
   */
  created_at: string;
  /**
   * @format date-time
   */
  updated_at: string;
  /**
   * @format date-time
   */
  closed_at: string;
  text_matches?: search_result_text_matches;
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
  body?: string;
  score: number;
  author_association: author_association;
  draft?: boolean;
  repository?: repository;
  body_html?: string;
  body_text?: string;
  /**
   * @format uri
   */
  timeline_url?: string;
  type?: issue_type;
  performed_via_github_app?: nullable_integration;
  pinned_comment?: nullable_issue_comment;
  reactions?: reaction_rollup;
};

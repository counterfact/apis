import type { nullable_simple_user } from "./nullable-simple-user.js";
import type { nullable_issue } from "./nullable-issue.js";
import type { issue_event_label } from "./issue-event-label.js";
import type { team } from "./team.js";
import type { issue_event_dismissed_review } from "./issue-event-dismissed-review.js";
import type { issue_event_milestone } from "./issue-event-milestone.js";
import type { issue_event_project_card } from "./issue-event-project-card.js";
import type { issue_event_rename } from "./issue-event-rename.js";
import type { author_association } from "./author-association.js";
import type { nullable_integration } from "./nullable-integration.js";

/**
 * Issue Event
 */
export type issue_event = {
  /**
   * @format int64
   * @example 1
   */
  id: number;
  /**
   * @example "MDEwOklzc3VlRXZlbnQx"
   */
  node_id: string;
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/issues/events/1"
   */
  url: string;
  actor: nullable_simple_user;
  /**
   * @example "closed"
   */
  event: string;
  /**
   * @example "6dcb09b5b57875f334f61aebed695e2e4193db5e"
   */
  commit_id: string;
  /**
   * @example "https://api.github.com/repos/octocat/Hello-World/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e"
   */
  commit_url: string;
  /**
   * @format date-time
   * @example "2011-04-14T16:00:49Z"
   */
  created_at: string;
  issue?: nullable_issue;
  label?: issue_event_label;
  assignee?: nullable_simple_user;
  assigner?: nullable_simple_user;
  review_requester?: nullable_simple_user;
  requested_reviewer?: nullable_simple_user;
  requested_team?: team;
  dismissed_review?: issue_event_dismissed_review;
  milestone?: issue_event_milestone;
  project_card?: issue_event_project_card;
  rename?: issue_event_rename;
  author_association?: author_association;
  lock_reason?: string;
  performed_via_github_app?: nullable_integration;
};

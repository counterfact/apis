import type { labeled_issue_event } from "./labeled-issue-event.js";
import type { unlabeled_issue_event } from "./unlabeled-issue-event.js";
import type { milestoned_issue_event } from "./milestoned-issue-event.js";
import type { demilestoned_issue_event } from "./demilestoned-issue-event.js";
import type { renamed_issue_event } from "./renamed-issue-event.js";
import type { review_requested_issue_event } from "./review-requested-issue-event.js";
import type { review_request_removed_issue_event } from "./review-request-removed-issue-event.js";
import type { review_dismissed_issue_event } from "./review-dismissed-issue-event.js";
import type { locked_issue_event } from "./locked-issue-event.js";
import type { added_to_project_issue_event } from "./added-to-project-issue-event.js";
import type { moved_column_in_project_issue_event } from "./moved-column-in-project-issue-event.js";
import type { removed_from_project_issue_event } from "./removed-from-project-issue-event.js";
import type { converted_note_to_issue_issue_event } from "./converted-note-to-issue-issue-event.js";
import type { timeline_comment_event } from "./timeline-comment-event.js";
import type { timeline_cross_referenced_event } from "./timeline-cross-referenced-event.js";
import type { timeline_committed_event } from "./timeline-committed-event.js";
import type { timeline_reviewed_event } from "./timeline-reviewed-event.js";
import type { timeline_line_commented_event } from "./timeline-line-commented-event.js";
import type { timeline_commit_commented_event } from "./timeline-commit-commented-event.js";
import type { timeline_assigned_issue_event } from "./timeline-assigned-issue-event.js";
import type { timeline_unassigned_issue_event } from "./timeline-unassigned-issue-event.js";
import type { state_change_issue_event } from "./state-change-issue-event.js";

/**
 * Timeline Event
 */
export type timeline_issue_events =
  | labeled_issue_event
  | unlabeled_issue_event
  | milestoned_issue_event
  | demilestoned_issue_event
  | renamed_issue_event
  | review_requested_issue_event
  | review_request_removed_issue_event
  | review_dismissed_issue_event
  | locked_issue_event
  | added_to_project_issue_event
  | moved_column_in_project_issue_event
  | removed_from_project_issue_event
  | converted_note_to_issue_issue_event
  | timeline_comment_event
  | timeline_cross_referenced_event
  | timeline_committed_event
  | timeline_reviewed_event
  | timeline_line_commented_event
  | timeline_commit_commented_event
  | timeline_assigned_issue_event
  | timeline_unassigned_issue_event
  | state_change_issue_event;

import type { labeled_issue_event } from "./labeled-issue-event.js";
import type { unlabeled_issue_event } from "./unlabeled-issue-event.js";
import type { assigned_issue_event } from "./assigned-issue-event.js";
import type { unassigned_issue_event } from "./unassigned-issue-event.js";
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

/**
 * Issue Event for Issue
 */
export type issue_event_for_issue =
  | labeled_issue_event
  | unlabeled_issue_event
  | assigned_issue_event
  | unassigned_issue_event
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
  | converted_note_to_issue_issue_event;

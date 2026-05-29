import type { pull_request_review_comment } from "./pull-request-review-comment.js";

/**
 * Timeline Line Commented Event
 */
export type timeline_line_commented_event = {
  event?: string;
  node_id?: string;
  comments?: Array<pull_request_review_comment>;
};

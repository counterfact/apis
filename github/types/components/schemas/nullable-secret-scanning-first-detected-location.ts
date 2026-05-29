import type { secret_scanning_location_commit } from "./secret-scanning-location-commit.js";
import type { secret_scanning_location_wiki_commit } from "./secret-scanning-location-wiki-commit.js";
import type { secret_scanning_location_issue_title } from "./secret-scanning-location-issue-title.js";
import type { secret_scanning_location_issue_body } from "./secret-scanning-location-issue-body.js";
import type { secret_scanning_location_issue_comment } from "./secret-scanning-location-issue-comment.js";
import type { secret_scanning_location_discussion_title } from "./secret-scanning-location-discussion-title.js";
import type { secret_scanning_location_discussion_body } from "./secret-scanning-location-discussion-body.js";
import type { secret_scanning_location_discussion_comment } from "./secret-scanning-location-discussion-comment.js";
import type { secret_scanning_location_pull_request_title } from "./secret-scanning-location-pull-request-title.js";
import type { secret_scanning_location_pull_request_body } from "./secret-scanning-location-pull-request-body.js";
import type { secret_scanning_location_pull_request_comment } from "./secret-scanning-location-pull-request-comment.js";
import type { secret_scanning_location_pull_request_review } from "./secret-scanning-location-pull-request-review.js";
import type { secret_scanning_location_pull_request_review_comment } from "./secret-scanning-location-pull-request-review-comment.js";

/**
 * Details on the location where the token was initially detected. This can be a commit, wiki commit, issue, discussion, pull request.
 *
 */
export type nullable_secret_scanning_first_detected_location =
  | secret_scanning_location_commit
  | secret_scanning_location_wiki_commit
  | secret_scanning_location_issue_title
  | secret_scanning_location_issue_body
  | secret_scanning_location_issue_comment
  | secret_scanning_location_discussion_title
  | secret_scanning_location_discussion_body
  | secret_scanning_location_discussion_comment
  | secret_scanning_location_pull_request_title
  | secret_scanning_location_pull_request_body
  | secret_scanning_location_pull_request_comment
  | secret_scanning_location_pull_request_review
  | secret_scanning_location_pull_request_review_comment;

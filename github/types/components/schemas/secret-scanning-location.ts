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

export type secret_scanning_location = {
  /**
   * The location type. Because secrets may be found in different types of resources (ie. code, comments, issues, pull requests, discussions), this field identifies the type of resource where the secret was found.
   * @example "commit"
   */
  type?:
    | "commit"
    | "wiki_commit"
    | "issue_title"
    | "issue_body"
    | "issue_comment"
    | "discussion_title"
    | "discussion_body"
    | "discussion_comment"
    | "pull_request_title"
    | "pull_request_body"
    | "pull_request_comment"
    | "pull_request_review"
    | "pull_request_review_comment";
  details?:
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
};

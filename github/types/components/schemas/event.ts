import type { actor } from "./actor.js";
import type { create_event } from "./create-event.js";
import type { delete_event } from "./delete-event.js";
import type { discussion_event } from "./discussion-event.js";
import type { issues_event } from "./issues-event.js";
import type { issue_comment_event } from "./issue-comment-event.js";
import type { fork_event } from "./fork-event.js";
import type { gollum_event } from "./gollum-event.js";
import type { member_event } from "./member-event.js";
import type { public_event } from "./public-event.js";
import type { push_event } from "./push-event.js";
import type { pull_request_event } from "./pull-request-event.js";
import type { pull_request_review_comment_event } from "./pull-request-review-comment-event.js";
import type { pull_request_review_event } from "./pull-request-review-event.js";
import type { commit_comment_event } from "./commit-comment-event.js";
import type { release_event } from "./release-event.js";
import type { watch_event } from "./watch-event.js";

/**
 * Event
 */
export type event = {
  id: string;
  type: string;
  actor: actor;
  repo: {
    id: number;
    name: string;
    /**
     * @format uri
     */
    url: string;
  };
  org?: actor;
  payload:
    | create_event
    | delete_event
    | discussion_event
    | issues_event
    | issue_comment_event
    | fork_event
    | gollum_event
    | member_event
    | public_event
    | push_event
    | pull_request_event
    | pull_request_review_comment_event
    | pull_request_review_event
    | commit_comment_event
    | release_event
    | watch_event;
  public: boolean;
  /**
   * @format date-time
   */
  created_at: string;
};

import type { simple_user } from "./simple-user.js";
import type { nullable_integration } from "./nullable-integration.js";
import type { team } from "./team.js";

/**
 * Review Request Removed Issue Event
 */
export type review_request_removed_issue_event = {
  id: number;
  node_id: string;
  url: string;
  actor: simple_user;
  event: string;
  commit_id: string;
  commit_url: string;
  created_at: string;
  performed_via_github_app: nullable_integration;
  review_requester: simple_user;
  requested_team?: team;
  requested_reviewer?: simple_user;
};

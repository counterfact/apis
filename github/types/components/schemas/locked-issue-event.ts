import type { simple_user } from "./simple-user.js";
import type { nullable_integration } from "./nullable-integration.js";

/**
 * Locked Issue Event
 */
export type locked_issue_event = {
  id: number;
  node_id: string;
  url: string;
  actor: simple_user;
  event: string;
  commit_id: string;
  commit_url: string;
  created_at: string;
  performed_via_github_app: nullable_integration;
  /**
   * @example "\"off-topic\""
   */
  lock_reason: string;
};

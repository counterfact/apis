import type { simple_user } from "./simple-user.js";
import type { integration } from "./integration.js";

/**
 * Assigned Issue Event
 */
export type assigned_issue_event = {
  id: number;
  node_id: string;
  url: string;
  actor: simple_user;
  event: string;
  commit_id: string;
  commit_url: string;
  created_at: string;
  performed_via_github_app: integration;
  assignee: simple_user;
  assigner: simple_user;
};

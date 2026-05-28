import type { simple_user } from "./simple-user.js";
import type { nullable_integration } from "./nullable-integration.js";

/**
 * Labeled Issue Event
 */
export type labeled_issue_event = {
  id: number;
  node_id: string;
  url: string;
  actor: simple_user;
  event: string;
  commit_id: string;
  commit_url: string;
  created_at: string;
  performed_via_github_app: nullable_integration;
  label: { name: string; color: string };
};

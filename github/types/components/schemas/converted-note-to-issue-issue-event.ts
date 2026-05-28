import type { simple_user } from "./simple-user.js";
import type { integration } from "./integration.js";

/**
 * Converted Note to Issue Issue Event
 */
export type converted_note_to_issue_issue_event = {
  id: number;
  node_id: string;
  url: string;
  actor: simple_user;
  event: string;
  commit_id: string;
  commit_url: string;
  created_at: string;
  performed_via_github_app: integration;
  project_card?: {
    id: number;
    /**
     * @format uri
     */
    url: string;
    project_id: number;
    /**
     * @format uri
     */
    project_url: string;
    column_name: string;
    previous_column_name?: string;
  };
};

import type { nullable_simple_user } from "./nullable-simple-user.js";

/**
 * A draft issue in a project
 */
export type projects_v2_draft_issue = {
  /**
   * The ID of the draft issue
   */
  id: number;
  /**
   * The node ID of the draft issue
   */
  node_id: string;
  /**
   * The title of the draft issue
   */
  title: string;
  /**
   * The body content of the draft issue
   */
  body?: string;
  user: nullable_simple_user;
  /**
   * The time the draft issue was created
   * @format date-time
   */
  created_at: string;
  /**
   * The time the draft issue was last updated
   * @format date-time
   */
  updated_at: string;
};

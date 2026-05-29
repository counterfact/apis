import type { issue } from "./issue.js";
import type { pull_request_simple } from "./pull-request-simple.js";
import type { projects_v2_draft_issue } from "./projects-v2-draft-issue.js";
import type { projects_v2_item_content_type } from "./projects-v2-item-content-type.js";
import type { simple_user } from "./simple-user.js";

/**
 * An item belonging to a project
 */
export type projects_v2_item_simple = {
  /**
   * The unique identifier of the project item.
   */
  id: number;
  /**
   * The node ID of the project item.
   */
  node_id?: string;
  /**
   * The content represented by the item.
   */
  content?: issue | pull_request_simple | projects_v2_draft_issue;
  content_type: projects_v2_item_content_type;
  creator?: simple_user;
  /**
   * The time when the item was created.
   * @format date-time
   * @example "2022-04-28T12:00:00Z"
   */
  created_at: string;
  /**
   * The time when the item was last updated.
   * @format date-time
   * @example "2022-04-28T12:00:00Z"
   */
  updated_at: string;
  /**
   * The time when the item was archived.
   * @format date-time
   * @example "2022-04-28T12:00:00Z"
   */
  archived_at: string;
  /**
   * The URL of the project this item belongs to.
   * @format uri
   */
  project_url?: string;
  /**
   * The URL of the item in the project.
   * @format uri
   */
  item_url?: string;
};

import type { simple_user } from "./simple-user.js";
import type { nullable_simple_user } from "./nullable-simple-user.js";
import type { nullable_projects_v2_status_update } from "./nullable-projects-v2-status-update.js";

/**
 * A projects v2 project
 */
export type projects_v2 = {
  /**
   * The unique identifier of the project.
   */
  id: number;
  /**
   * The node ID of the project.
   */
  node_id: string;
  owner: simple_user;
  creator: simple_user;
  /**
   * The project title.
   */
  title: string;
  /**
   * A short description of the project.
   */
  description: string;
  /**
   * Whether the project is visible to anyone with access to the owner.
   */
  public: boolean;
  /**
   * The time when the project was closed.
   * @format date-time
   * @example "2022-04-28T12:00:00Z"
   */
  closed_at: string;
  /**
   * The time when the project was created.
   * @format date-time
   * @example "2022-04-28T12:00:00Z"
   */
  created_at: string;
  /**
   * The time when the project was last updated.
   * @format date-time
   * @example "2022-04-28T12:00:00Z"
   */
  updated_at: string;
  /**
   * The project number.
   */
  number: number;
  /**
   * A concise summary of the project.
   */
  short_description: string;
  /**
   * The time when the project was deleted.
   * @format date-time
   * @example "2022-04-28T12:00:00Z"
   */
  deleted_at: string;
  deleted_by: nullable_simple_user;
  /**
   * The current state of the project.
   */
  state?: "open" | "closed";
  latest_status_update?: nullable_projects_v2_status_update;
  /**
   * Whether this project is a template
   */
  is_template?: boolean;
};

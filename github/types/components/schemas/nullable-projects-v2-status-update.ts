import type { simple_user } from "./simple-user.js";

/**
 * An status update belonging to a project
 */
export type nullable_projects_v2_status_update = {
  /**
   * The unique identifier of the status update.
   */
  id: number;
  /**
   * The node ID of the status update.
   */
  node_id: string;
  /**
   * The node ID of the project that this status update belongs to.
   */
  project_node_id?: string;
  creator?: simple_user;
  /**
   * The time when the status update was created.
   * @format date-time
   * @example "2022-04-28T12:00:00Z"
   */
  created_at: string;
  /**
   * The time when the status update was last updated.
   * @format date-time
   * @example "2022-04-28T12:00:00Z"
   */
  updated_at: string;
  /**
   * The current status.
   */
  status?: "INACTIVE" | "ON_TRACK" | "AT_RISK" | "OFF_TRACK" | "COMPLETE";
  /**
   * The start date of the period covered by the update.
   * @format date
   * @example "2022-04-28"
   */
  start_date?: string;
  /**
   * The target date associated with the update.
   * @format date
   * @example "2022-04-28"
   */
  target_date?: string;
  /**
   * Body of the status update
   * @example "The project is off to a great start!"
   */
  body?: string;
};

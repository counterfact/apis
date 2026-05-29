import type { simple_user } from "./simple-user.js";

/**
 * A view inside a projects v2 project
 */
export type projects_v2_view = {
  /**
   * The unique identifier of the view.
   */
  id: number;
  /**
   * The number of the view within the project.
   */
  number: number;
  /**
   * The name of the view.
   */
  name: string;
  /**
   * The layout of the view.
   */
  layout: "table" | "board" | "roadmap";
  /**
   * The node ID of the view.
   */
  node_id: string;
  /**
   * The API URL of the project that contains the view.
   * @example "https://api.github.com/orgs/octocat/projectsV2/1"
   */
  project_url: string;
  /**
   * The web URL of the view.
   * @format uri
   * @example "https://github.com/orgs/octocat/projects/1/views/1"
   */
  html_url: string;
  creator: simple_user;
  /**
   * The time when the view was created.
   * @format date-time
   * @example "2022-04-28T12:00:00Z"
   */
  created_at: string;
  /**
   * The time when the view was last updated.
   * @format date-time
   * @example "2022-04-28T12:00:00Z"
   */
  updated_at: string;
  /**
   * The filter query for the view.
   * @example "is:issue is:open"
   */
  filter?: string;
  /**
   * The list of field IDs that are visible in the view.
   */
  visible_fields: Array<number>;
  /**
   * The sorting configuration for the view. Each element is a tuple of [field_id, direction] where direction is "asc" or "desc".
   */
  sort_by: Array<Array<number | string>>;
  /**
   * The list of field IDs used for horizontal grouping.
   */
  group_by: Array<number>;
  /**
   * The list of field IDs used for vertical grouping (board layout).
   */
  vertical_group_by: Array<number>;
};

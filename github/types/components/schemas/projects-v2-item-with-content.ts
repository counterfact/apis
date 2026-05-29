import type { projects_v2_item_content_type } from "./projects-v2-item-content-type.js";
import type { simple_user } from "./simple-user.js";

/**
 * An item belonging to a project
 */
export type projects_v2_item_with_content = {
  /**
   * The unique identifier of the project item.
   */
  id: number;
  /**
   * The node ID of the project item.
   */
  node_id?: string;
  /**
   * The API URL of the project that contains this item.
   * @format uri
   * @example "https://api.github.com/users/monalisa/2/projectsV2/3"
   */
  project_url?: string;
  content_type: projects_v2_item_content_type;
  /**
   * The content of the item, which varies by content type.
   */
  content?: { [key: string]: unknown };
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
   * The API URL of this item.
   * @format uri
   * @example "https://api.github.com/users/monalisa/2/projectsV2/items/3"
   */
  item_url?: string;
  /**
   * The fields and values associated with this item.
   */
  fields?: Array<{ [key: string]: unknown }>;
};

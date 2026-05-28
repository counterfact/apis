import type { custom_property_value } from "./custom-property-value.js";

/**
 * List of custom property values for a repository
 */
export type org_repo_custom_property_values = {
  /**
   * @example 1296269
   */
  repository_id: number;
  /**
   * @example "Hello-World"
   */
  repository_name: string;
  /**
   * @example "octocat/Hello-World"
   */
  repository_full_name: string;
  /**
   * List of custom property names and associated values
   */
  properties: Array<custom_property_value>;
};

import type { projects_v2_single_select_options } from "./projects-v2-single-select-options.js";
import type { projects_v2_iteration_settings } from "./projects-v2-iteration-settings.js";

/**
 * A field inside a projects v2 project
 */
export type projects_v2_field = {
  /**
   * The unique identifier of the field.
   */
  id: number;
  /**
   * The ID of the issue field.
   */
  issue_field_id?: number;
  /**
   * The node ID of the field.
   */
  node_id?: string;
  /**
   * The API URL of the project that contains the field.
   * @example "https://api.github.com/projects/1"
   */
  project_url: string;
  /**
   * The name of the field.
   */
  name: string;
  /**
   * The field's data type.
   */
  data_type:
    | "assignees"
    | "linked_pull_requests"
    | "reviewers"
    | "labels"
    | "milestone"
    | "repository"
    | "title"
    | "text"
    | "single_select"
    | "number"
    | "date"
    | "iteration"
    | "issue_type"
    | "parent_issue"
    | "sub_issues_progress";
  /**
   * The options available for single select fields.
   */
  options?: Array<projects_v2_single_select_options>;
  /**
   * Configuration for iteration fields.
   */
  configuration?: {
    /**
     * The day of the week when the iteration starts.
     */
    start_day?: number;
    /**
     * The duration of the iteration in days.
     */
    duration?: number;
    iterations?: Array<projects_v2_iteration_settings>;
  };
  /**
   * The time when the field was created.
   * @format date-time
   * @example "2022-04-28T12:00:00Z"
   */
  created_at: string;
  /**
   * The time when the field was last updated.
   * @format date-time
   * @example "2022-04-28T12:00:00Z"
   */
  updated_at: string;
};

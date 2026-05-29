/**
 * A custom attribute defined at the organization level for attaching structured data to issues.
 */
export type issue_field = {
  /**
   * The unique identifier of the issue field.
   */
  id: number;
  /**
   * The node identifier of the issue field.
   */
  node_id: string;
  /**
   * The name of the issue field.
   */
  name: string;
  /**
   * The description of the issue field.
   */
  description?: string;
  /**
   * The data type of the issue field.
   */
  data_type: "text" | "date" | "single_select" | "number";
  /**
   * The visibility of the issue field. Can be `organization_members_only` (visible only within the organization) or `all` (visible to all users who can see issues).
   */
  visibility?: "organization_members_only" | "all";
  /**
   * Available options for single select fields.
   */
  options?: Array<{
    /**
     * The unique identifier of the option.
     */
    id: number;
    /**
     * The name of the option.
     */
    name: string;
    /**
     * The description of the option.
     */
    description?: string;
    /**
     * The color of the option.
     */
    color?:
      | "gray"
      | "blue"
      | "green"
      | "yellow"
      | "orange"
      | "red"
      | "pink"
      | "purple";
    /**
     * The priority of the option for ordering.
     */
    priority?: number;
    /**
     * The time the option was created.
     * @format date-time
     */
    created_at?: string;
    /**
     * The time the option was last updated.
     * @format date-time
     */
    updated_at?: string;
  }>;
  /**
   * The time the issue field was created.
   * @format date-time
   */
  created_at?: string;
  /**
   * The time the issue field was last updated.
   * @format date-time
   */
  updated_at?: string;
};

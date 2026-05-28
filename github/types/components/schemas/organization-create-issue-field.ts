export type organization_create_issue_field = {
  /**
   * Name of the issue field.
   */
  name: string;
  /**
   * Description of the issue field.
   */
  description?: string;
  /**
   * The data type of the issue field.
   */
  data_type: "text" | "date" | "single_select" | "number";
  /**
   * The visibility of the issue field. Can be `organization_members_only` (visible only within the organization) or `all` (visible to all users who can see issues). Only used when the visibility settings feature is enabled. Defaults to `organization_members_only`.
   */
  visibility?: "organization_members_only" | "all";
  /**
   * Options for single select fields. Required when data_type is 'single_select'.
   */
  options?: Array<{
    /**
     * Name of the option.
     */
    name: string;
    /**
     * Description of the option.
     */
    description?: string;
    /**
     * Color for the option.
     */
    color:
      | "gray"
      | "blue"
      | "green"
      | "yellow"
      | "orange"
      | "red"
      | "pink"
      | "purple";
    /**
     * Priority of the option for ordering.
     */
    priority: number;
  }>;
};

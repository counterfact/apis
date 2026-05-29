export type organization_update_issue_field = {
  /**
   * Name of the issue field.
   */
  name?: string;
  /**
   * Description of the issue field.
   */
  description?: string;
  /**
   * The visibility of the issue field. Can be `organization_members_only` (visible only within the organization) or `all` (visible to all users who can see issues). Only used when the visibility settings feature is enabled.
   */
  visibility?: "organization_members_only" | "all";
  /**
   * Options for single select fields. Only applicable when updating single_select fields. When provided, this array **replaces** the entire existing set of options rather than adding to or updating individual options. To retain or update an existing option, include it in the array with its `id`. Options sent without an `id` are treated as new options and may cause existing options to be deleted and recreated.
   */
  options?: Array<{
    /**
     * The id of an existing option to retain or update. Omit this when creating a new option.
     */
    id?: number;
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

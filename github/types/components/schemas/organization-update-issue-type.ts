export type organization_update_issue_type = {
  /**
   * Name of the issue type.
   */
  name: string;
  /**
   * Whether or not the issue type is enabled at the organization level.
   */
  is_enabled: boolean;
  /**
   * Description of the issue type.
   */
  description?: string;
  /**
   * Color for the issue type.
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
};

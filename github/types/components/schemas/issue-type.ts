/**
 * The type assigned to the issue. This is only present for issues in repositories where issue types are supported.
 */
export type issue_type = {
  /**
   * The unique identifier of the issue type.
   */
  id: number;
  /**
   * The node identifier of the issue type.
   */
  node_id: string;
  /**
   * The name of the issue type.
   */
  name: string;
  /**
   * The description of the issue type.
   */
  description: string;
  /**
   * The color of the issue type.
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
   * The time the issue type created.
   * @format date-time
   */
  created_at?: string;
  /**
   * The time the issue type last updated.
   * @format date-time
   */
  updated_at?: string;
  /**
   * The enabled state of the issue type.
   */
  is_enabled?: boolean;
};

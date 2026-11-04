export type DependentAvailableAgentIdentifier = {
  /**
   * If the agent is a transitive dependent, contains IDs of the resources that the agent depends on directly.
   */
  referenced_resource_ids?: Array<string>;
  id: string;
  name: string;
  /**
   * @default "available"
   */
  type?: "available";
  created_at_unix_secs: number;
  access_level: "admin" | "editor" | "commenter" | "viewer";
};

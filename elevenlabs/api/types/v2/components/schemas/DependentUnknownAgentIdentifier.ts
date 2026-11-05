/**
 * A model that represents an agent dependent on a knowledge base/tools
 * to which the user has no direct access.
 */
export type DependentUnknownAgentIdentifier = {
  /**
   * If the agent is a transitive dependent, contains IDs of the resources that the agent depends on directly.
   */
  referenced_resource_ids?: Array<string>;
  id: string;
  /**
   * @default "unknown"
   */
  type?: "unknown";
};

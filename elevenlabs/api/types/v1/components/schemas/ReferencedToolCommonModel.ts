/**
 * Reference to a tool for unit test evaluation.
 */
export type ReferencedToolCommonModel = {
  /**
   * The ID of the tool
   */
  id: string;
  /**
   * The type of the tool
   */
  type:
    | "system"
    | "webhook"
    | "client"
    | "workflow"
    | "api_integration_webhook"
    | "mcp"
    | "code";
};

/**
 * Snapshot of the MCP tool definition that was approved.
 */
export type MCPApprovedToolDefinition = {
  /**
   * The MCP server-provided tool description at approval time
   * @default ""
   */
  description?: string;
  /**
   * The MCP server-provided JSON input schema at approval time
   */
  input_schema?: { [key: string]: unknown };
};

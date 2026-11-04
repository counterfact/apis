import type { MCPToolApprovalPolicy } from "./MCPToolApprovalPolicy.js";
/**
 * Request model for adding approval for a single MCP tool.
 */
export type MCPToolAddApprovalRequestModel = {
  /**
   * The name of the MCP tool
   */
  tool_name: string;
  /**
   * The description of the MCP tool
   */
  tool_description: string;
  /**
   * The input schema of the MCP tool (the schema defined on the MCP server before ElevenLabs does any extra processing)
   */
  input_schema?: { [key: string]: unknown };
  /**
   * The tool-level approval policy
   * @default "requires_approval"
   */
  approval_policy?: MCPToolApprovalPolicy;
};

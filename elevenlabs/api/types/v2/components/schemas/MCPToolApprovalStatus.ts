import type { MCPToolApprovalState } from "./MCPToolApprovalState.js";
import type { MCPToolApprovalPolicy } from "./MCPToolApprovalPolicy.js";
import type { MCPApprovedToolDefinition } from "./MCPApprovedToolDefinition.js";
/**
 * Derived approval state for a currently discovered MCP tool.
 */
export type MCPToolApprovalStatus = {
  /**
   * Canonical MCP tool identifier in the form mcp:<server_id>:<tool_name>
   */
  tool_id: string;
  /**
   * Whether a stored approval exists and still matches the live tool definition
   */
  state: MCPToolApprovalState;
  /**
   * Stored execution policy. Set when the tool has an approval.
   */
  approval_policy?: MCPToolApprovalPolicy | null;
  /**
   * Previously approved definition, included when the tool needs review and a snapshot exists.
   */
  approved_definition?: MCPApprovedToolDefinition | null;
};

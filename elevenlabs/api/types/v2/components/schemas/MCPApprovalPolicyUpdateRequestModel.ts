import type { MCPApprovalPolicy } from "./MCPApprovalPolicy.js";
/**
 * Request model for updating MCP Server approval mode.
 */
export type MCPApprovalPolicyUpdateRequestModel = {
  /**
   * The approval mode to set for the MCP server
   */
  approval_policy: MCPApprovalPolicy;
};

import type { MCPToolApprovalPolicy } from "./MCPToolApprovalPolicy.js";
/**
 * Model for storing tool approval hashes for per-tool approval.
 */
export type MCPToolApprovalHash = {
  /**
   * The name of the MCP tool
   */
  tool_name: string;
  /**
   * SHA256 hash of the tool's parameters and description
   */
  tool_hash: string;
  /**
   * The approval policy for this tool
   * @default "requires_approval"
   */
  approval_policy?: MCPToolApprovalPolicy;
};

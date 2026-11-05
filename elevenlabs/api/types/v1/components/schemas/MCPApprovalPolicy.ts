/**
 * Defines the MCP server-level approval policy for tool execution.
 * @default "require_approval_all"
 */
export type MCPApprovalPolicy =
  "auto_approve_all" | "require_approval_all" | "require_approval_per_tool";

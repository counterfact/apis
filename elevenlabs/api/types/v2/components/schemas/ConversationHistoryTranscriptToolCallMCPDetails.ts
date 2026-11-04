export type ConversationHistoryTranscriptToolCallMCPDetails = {
  /**
   * @default "mcp"
   */
  type?: "mcp";
  mcp_server_id: string;
  mcp_server_name: string;
  integration_type: string;
  parameters?: { [key: string]: string };
  approval_policy: string;
  /**
   * @default false
   */
  requires_approval?: boolean;
  /**
   * @default ""
   */
  mcp_tool_name?: string;
  /**
   * @default ""
   */
  mcp_tool_description?: string;
};

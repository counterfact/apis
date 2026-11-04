import type { MCPServerResponseModel } from "./MCPServerResponseModel.js";
/**
 * Response model for a list of MCP Server configurations.
 */
export type MCPServersResponseModel = {
  mcp_servers: Array<MCPServerResponseModel>;
};

import type { MCPServerConfig_Input } from "./MCPServerConfig-Input.js";
/**
 * Request model for creating/updating an MCP Server configuration.
 */
export type MCPServerRequestModel = {
  /**
   * Configuration details for the MCP Server.
   */
  config: MCPServerConfig_Input;
};

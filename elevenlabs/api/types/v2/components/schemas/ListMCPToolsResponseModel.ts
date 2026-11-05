import type { Tool } from "./Tool.js";
import type { MCPToolApprovalStatus } from "./MCPToolApprovalStatus.js";
/**
 * Response model for testing tools available on an MCP server.
 * @example {"success":true,"tool_approval_statuses":[],"tools":[{"description":"Gets current weather conditions for a location.","inputSchema":{"properties":{"latitude":{"description":"Latitude","type":"string"},"longitude":{"description":"Longitude","type":"string"}},"required":["latitude","longitude"],"type":"object"},"name":"weather_by_zapier_get_current"},{"description":"Description of tool2","inputSchema":{"properties":{},"type":"object"},"name":"tool2"}]}
 */
export type ListMCPToolsResponseModel = {
  /**
   * Indicates if the operation was successful.
   */
  success: boolean;
  /**
   * A list of tools available on the MCP server.
   */
  tools: Array<Tool>;
  /**
   * Derived approval states for currently discovered tools. Populated only for persisted MCP servers using per-tool approval; otherwise empty.
   */
  tool_approval_statuses?: Array<MCPToolApprovalStatus>;
  /**
   * Error message if the operation was not successful.
   */
  error_message?: string | null;
};

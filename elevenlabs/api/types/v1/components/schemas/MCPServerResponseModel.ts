import type { MCPServerConfig_Output } from "./MCPServerConfig-Output.js";
import type { ResourceAccessInfo } from "./ResourceAccessInfo.js";
import type { DependentAvailableAgentIdentifier } from "./DependentAvailableAgentIdentifier.js";
import type { DependentUnknownAgentIdentifier } from "./DependentUnknownAgentIdentifier.js";
import type { MCPServerMetadataResponseModel } from "./MCPServerMetadataResponseModel.js";
/**
 * Response model representing an MCP Server configuration.
 */
export type MCPServerResponseModel = {
  id: string;
  config: MCPServerConfig_Output;
  /**
   * The access information of the MCP Server
   */
  access_info?: ResourceAccessInfo | null;
  /**
   * List of agents that depend on this MCP Server.
   */
  dependent_agents?: Array<
    | (DependentAvailableAgentIdentifier & { type: "available" })
    | (DependentUnknownAgentIdentifier & { type: "unknown" })
  >;
  /**
   * The metadata of the MCP Server
   */
  metadata: MCPServerMetadataResponseModel;
};

import type { WebhookToolConfig_Output } from "./WebhookToolConfig-Output.js";
import type { ClientToolConfig_Output } from "./ClientToolConfig-Output.js";
import type { SystemToolConfig_Output } from "./SystemToolConfig-Output.js";
import type { MCPToolConfig_Output } from "./MCPToolConfig-Output.js";
import type { ResourceAccessInfo } from "./ResourceAccessInfo.js";
import type { ToolUsageStatsResponseModel } from "./ToolUsageStatsResponseModel.js";
import type { ToolResponseMockConfig_Output } from "./ToolResponseMockConfig-Output.js";
export type ToolResponseModel = {
  id: string;
  /**
   * The type of tool
   */
  tool_config:
    | (WebhookToolConfig_Output & { type: "webhook" })
    | (ClientToolConfig_Output & { type: "client" })
    | (SystemToolConfig_Output & { type: "system" })
    | (MCPToolConfig_Output & { type: "mcp" });
  access_info: ResourceAccessInfo;
  usage_stats: ToolUsageStatsResponseModel;
  /**
   * Mock responses with optional parameter conditions. Evaluated top-to-bottom; first match wins.
   */
  response_mocks?: Array<ToolResponseMockConfig_Output> | null;
};

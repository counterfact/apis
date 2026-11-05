import type { WebhookToolConfig_Input } from "./WebhookToolConfig-Input.js";
import type { ClientToolConfig_Input } from "./ClientToolConfig-Input.js";
import type { SystemToolConfig_Input } from "./SystemToolConfig-Input.js";
import type { MCPToolConfig_Input } from "./MCPToolConfig-Input.js";
import type { ToolResponseMockConfig_Input } from "./ToolResponseMockConfig-Input.js";
export type ToolRequestModel = {
  /**
   * Configuration for the tool
   */
  tool_config:
    | (WebhookToolConfig_Input & { type: "webhook" })
    | (ClientToolConfig_Input & { type: "client" })
    | (SystemToolConfig_Input & { type: "system" })
    | (MCPToolConfig_Input & { type: "mcp" });
  /**
   * Mock responses with optional parameter conditions. Evaluated top-to-bottom; first match wins.
   */
  response_mocks?: Array<ToolResponseMockConfig_Input> | null;
};

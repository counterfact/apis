import type { DependentAvailableToolIdentifier } from "./DependentAvailableToolIdentifier.js";
import type { DependentUnknownToolIdentifier } from "./DependentUnknownToolIdentifier.js";
import type { DependentAvailableMCPServerIdentifier } from "./DependentAvailableMCPServerIdentifier.js";
import type { DependentUnknownMCPServerIdentifier } from "./DependentUnknownMCPServerIdentifier.js";
import type { DependentIntegrationConnectionIdentifier } from "./DependentIntegrationConnectionIdentifier.js";
/**
 * Dependencies that use an auth connection
 */
export type AuthConnectionDependencies = {
  /**
   * @default []
   */
  tools?: Array<
    | (DependentAvailableToolIdentifier & { type: "available" })
    | (DependentUnknownToolIdentifier & { type: "unknown" })
  >;
  /**
   * @default []
   */
  mcp_servers?: Array<
    | (DependentAvailableMCPServerIdentifier & { type: "available" })
    | (DependentUnknownMCPServerIdentifier & { type: "unknown" })
  >;
  /**
   * @default []
   */
  integration_connections?: Array<DependentIntegrationConnectionIdentifier>;
};

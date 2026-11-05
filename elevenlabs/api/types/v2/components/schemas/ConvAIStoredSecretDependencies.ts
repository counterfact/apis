import type { DependentAvailableToolIdentifier } from "./DependentAvailableToolIdentifier.js";
import type { DependentUnknownToolIdentifier } from "./DependentUnknownToolIdentifier.js";
import type { DependentAvailableAgentIdentifier } from "./DependentAvailableAgentIdentifier.js";
import type { DependentUnknownAgentIdentifier } from "./DependentUnknownAgentIdentifier.js";
import type { DependentPhoneNumberIdentifier } from "./DependentPhoneNumberIdentifier.js";
import type { DependentAvailableMCPServerIdentifier } from "./DependentAvailableMCPServerIdentifier.js";
import type { DependentUnknownMCPServerIdentifier } from "./DependentUnknownMCPServerIdentifier.js";
import type { SecretDependencyType } from "./SecretDependencyType.js";
export type ConvAIStoredSecretDependencies = {
  tools: Array<
    | (DependentAvailableToolIdentifier & { type: "available" })
    | (DependentUnknownToolIdentifier & { type: "unknown" })
  >;
  /**
   * Whether there are more tool dependents beyond the returned preview
   * @default false
   */
  tools_has_more?: boolean;
  agents: Array<
    | (DependentAvailableAgentIdentifier & { type: "available" })
    | (DependentUnknownAgentIdentifier & { type: "unknown" })
  >;
  /**
   * Whether there are more agent dependents beyond the returned preview
   * @default false
   */
  agents_has_more?: boolean;
  phone_numbers?: Array<DependentPhoneNumberIdentifier>;
  /**
   * Whether there are more phone number dependents beyond the returned preview
   * @default false
   */
  phone_numbers_has_more?: boolean;
  mcp_servers?: Array<
    | (DependentAvailableMCPServerIdentifier & { type: "available" })
    | (DependentUnknownMCPServerIdentifier & { type: "unknown" })
  >;
  others: Array<SecretDependencyType>;
};

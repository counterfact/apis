import type { DependentAvailableToolIdentifier } from "./DependentAvailableToolIdentifier.js";
import type { DependentUnknownToolIdentifier } from "./DependentUnknownToolIdentifier.js";
import type { DependentAvailableAgentIdentifier } from "./DependentAvailableAgentIdentifier.js";
import type { DependentUnknownAgentIdentifier } from "./DependentUnknownAgentIdentifier.js";
import type { DependentPhoneNumberIdentifier } from "./DependentPhoneNumberIdentifier.js";
export type GetSecretDependenciesResponseModel = {
  dependencies:
    | Array<
        | (DependentAvailableToolIdentifier & { type: "available" })
        | (DependentUnknownToolIdentifier & { type: "unknown" })
      >
    | Array<
        | (DependentAvailableAgentIdentifier & { type: "available" })
        | (DependentUnknownAgentIdentifier & { type: "unknown" })
      >
    | Array<DependentPhoneNumberIdentifier>;
  /**
   * Cursor for fetching the next page of dependencies
   */
  next_cursor?: string | null;
};

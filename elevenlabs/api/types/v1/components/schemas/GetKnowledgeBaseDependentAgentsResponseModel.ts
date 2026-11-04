import type { DependentAvailableAgentIdentifier } from "./DependentAvailableAgentIdentifier.js";
import type { DependentUnknownAgentIdentifier } from "./DependentUnknownAgentIdentifier.js";
import type { DependentBranchInfo } from "./DependentBranchInfo.js";
export type GetKnowledgeBaseDependentAgentsResponseModel = {
  agents: Array<
    | (DependentAvailableAgentIdentifier & { type: "available" })
    | (DependentUnknownAgentIdentifier & { type: "unknown" })
  >;
  branches?: Array<DependentBranchInfo>;
  next_cursor?: string | null;
  has_more: boolean;
};

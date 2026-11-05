import type { ListResponseMeta } from "./ListResponseMeta.js";
import type { AgentBranchSummary } from "./AgentBranchSummary.js";
export type ListResponse_AgentBranchSummary_ = {
  /**
   * @default {}
   */
  meta?: ListResponseMeta;
  results: Array<AgentBranchSummary>;
};

import type { ListResponseMeta } from "./ListResponseMeta.js";
import type { AgentDeploymentHistoryItem } from "./AgentDeploymentHistoryItem.js";
export type ListResponse_AgentDeploymentHistoryItem_ = {
  /**
   * @default {}
   */
  meta?: ListResponseMeta;
  results: Array<AgentDeploymentHistoryItem>;
};

import type { AgentTopicResponseModel } from "./AgentTopicResponseModel.js";
export type GetAgentTopicsResponseModel = {
  topics: Array<AgentTopicResponseModel>;
  window_start_unix_secs: number;
  window_end_unix_secs: number;
  /**
   * Number of daily topic-discovery runs the returned metrics were summed over.
   * @default 0
   */
  aggregated_run_count?: number;
  /**
   * @default false
   */
  has_more?: boolean;
  next_cursor?: string | null;
};

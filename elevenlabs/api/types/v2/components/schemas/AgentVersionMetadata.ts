import type { AgentVersionParents } from "./AgentVersionParents.js";
import type { ResourceAccessInfo } from "./ResourceAccessInfo.js";
export type AgentVersionMetadata = {
  id: string;
  agent_id: string;
  branch_id: string;
  version_description: string;
  seq_no_in_branch: number;
  time_committed_secs: number;
  parents: AgentVersionParents;
  access_info?: ResourceAccessInfo | null;
  /**
   * For a merge into the main branch, the people who published the merged changes on the source branch (access_info is whoever ran the merge). Null when not recorded.
   */
  merged_authors?: Array<ResourceAccessInfo> | null;
};

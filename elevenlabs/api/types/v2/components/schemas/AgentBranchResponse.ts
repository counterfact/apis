import type { BranchProtectionStatus } from "./BranchProtectionStatus.js";
import type { ResourceAccessInfo } from "./ResourceAccessInfo.js";
import type { AgentBranchBasicInfo } from "./AgentBranchBasicInfo.js";
import type { AgentVersionMetadata } from "./AgentVersionMetadata.js";
export type AgentBranchResponse = {
  id: string;
  name: string;
  agent_id: string;
  description: string;
  created_at: number;
  last_committed_at: number;
  is_archived: boolean;
  /**
   * @default "writer_perms_required"
   */
  protection_status?: BranchProtectionStatus;
  /**
   * @default false
   */
  auto_rebase?: boolean;
  /**
   * Access information for the branch
   */
  access_info?: ResourceAccessInfo | null;
  /**
   * Percentage of traffic live on the branch
   * @default 0
   */
  current_live_percentage?: number;
  /**
   * Parent branch of the branch
   */
  parent_branch?: AgentBranchBasicInfo | null;
  /**
   * Most recent versions on the branch
   */
  most_recent_versions?: Array<AgentVersionMetadata>;
};

import type { BranchProtectionStatus } from "./BranchProtectionStatus.js";
import type { ResourceAccessInfo } from "./ResourceAccessInfo.js";
export type AgentBranchSummary = {
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
   * ID of the parent branch
   */
  parent_branch_id?: string | null;
  /**
   * Whether a draft exists for the branch
   * @default false
   */
  draft_exists?: boolean;
  /**
   * Unix seconds when the caller's draft on this branch was first created, or null when they have no draft. A draft created before last_committed_at was written against a config the branch has since moved past, so it may not reflect the current one.
   */
  draft_created_at?: number | null;
  /**
   * Whether the caller's draft on this branch was created before the branch's last commit, meaning it was written against a config the branch has since moved past and may not reflect the current one.
   * @default false
   */
  draft_is_behind_tip?: boolean;
  /**
   * Number of calls in the last 7 days
   * @default 0
   */
  calls_7d?: number;
  /**
   * Number of commits on this branch not yet on main, relative to their common ancestor. Null if it could not be computed (e.g. no common ancestor, or the branch history exceeds the comparison budget).
   */
  commits_ahead?: number | null;
  /**
   * Number of commits on main not yet incorporated into this branch, relative to their common ancestor. Null if it could not be computed (e.g. no common ancestor, or the branch history exceeds the comparison budget).
   */
  commits_behind?: number | null;
  /**
   * ID of the branch this branch's tip version was merged into, if any
   */
  merged_into_branch_id?: string | null;
};

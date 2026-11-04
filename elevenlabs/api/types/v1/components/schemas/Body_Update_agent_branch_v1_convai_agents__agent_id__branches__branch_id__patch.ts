import type { BranchProtectionStatus } from "./BranchProtectionStatus.js";
export type Body_Update_agent_branch_v1_convai_agents__agent_id__branches__branch_id__patch =
  {
    /**
     * New name for the branch. Must be unique within the agent.
     */
    name?: string | null;
    /**
     * New description for the branch. Pass an empty string to clear it.
     */
    description?: string | null;
    /**
     * Whether the branch should be archived
     */
    is_archived?: boolean | null;
    /**
     * The protection level for the branch
     */
    protection_status?: BranchProtectionStatus | null;
    /**
     * When true, rebase this branch onto main automatically after each new main version. Cannot be enabled on the main branch.
     */
    auto_rebase?: boolean | null;
  };

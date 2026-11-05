import type { AgentWorkflowRequestModel } from "./AgentWorkflowRequestModel.js";
export type Body_Create_a_new_branch_v1_convai_agents__agent_id__branches_post =
  {
    /**
     * ID of the version to branch from
     */
    parent_version_id: string;
    /**
     * Name of the branch. It is unique within the agent.
     */
    name: string;
    /**
     * Description for the branch
     */
    description: string;
    /**
     * Changes to apply to conversation config
     */
    conversation_config?: { [key: string]: unknown } | null;
    /**
     * Changes to apply to platform settings
     */
    platform_settings?: { [key: string]: unknown } | null;
    /**
     * Updated workflow definition
     */
    workflow?: AgentWorkflowRequestModel | null;
    /**
     * When true, the new branch uses the caller's draft procedure set instead of the branch tip. Requires parent_version_id to be the branch tip.
     * @default false
     */
    include_draft?: boolean;
  };

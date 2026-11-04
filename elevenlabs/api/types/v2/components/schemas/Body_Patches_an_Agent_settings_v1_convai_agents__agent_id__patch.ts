import type { AgentWorkflowRequestModel } from "./AgentWorkflowRequestModel.js";
import type { ProcedureVersionRef } from "./ProcedureVersionRef.js";
export type Body_Patches_an_Agent_settings_v1_convai_agents__agent_id__patch = {
  /**
   * Conversation configuration for an agent
   */
  conversation_config?: { [key: string]: unknown } | null;
  /**
   * Platform settings for the agent are all settings that aren't related to the conversation orchestration and content.
   */
  platform_settings?: { [key: string]: unknown } | null;
  /**
   * Workflow for the agent. This is used to define the flow of the conversation and how the agent interacts with tools.
   */
  workflow?: AgentWorkflowRequestModel;
  /**
   * A name to make the agent easier to find
   */
  name?: string | null;
  /**
   * Tags to help classify and filter the agent
   */
  tags?: Array<string> | null;
  /**
   * Description for this version when publishing changes (only applicable for versioned agents)
   */
  version_description?: string | null;
  /**
   * Procedure versions to publish, keyed by procedure_id. When provided, this map replaces the procedures from the current draft or branch tip. When omitted or null, unpublished procedure edits are used if present; otherwise, the branch tip's procedures are retained. Pass an empty object to remove all procedures.
   */
  procedures?: { [key: string]: ProcedureVersionRef } | null;
};

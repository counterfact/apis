import type { AgentWorkflowRequestModel } from "./AgentWorkflowRequestModel.js";
export type Body_Create_agent_draft_v1_convai_agents__agent_id__drafts_post = {
  /**
   * Conversation config for the draft
   */
  conversation_config: { [key: string]: unknown };
  /**
   * Platform settings for the draft
   */
  platform_settings: { [key: string]: unknown };
  /**
   * Workflow for the draft
   */
  workflow: AgentWorkflowRequestModel;
  /**
   * Name for the draft
   */
  name: string;
  /**
   * Tags to help classify and filter the agent
   */
  tags?: Array<string> | null;
};

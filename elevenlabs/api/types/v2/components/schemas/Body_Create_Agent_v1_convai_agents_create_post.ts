import type { ConversationalConfigAPIModel_Input } from "./ConversationalConfigAPIModel-Input.js";
import type { AgentPlatformSettingsRequestModel } from "./AgentPlatformSettingsRequestModel.js";
import type { AgentWorkflowRequestModel } from "./AgentWorkflowRequestModel.js";
export type Body_Create_Agent_v1_convai_agents_create_post = {
  /**
   * Conversation configuration for an agent
   */
  conversation_config: ConversationalConfigAPIModel_Input;
  /**
   * Platform settings for the agent are all settings that aren't related to the conversation orchestration and content.
   */
  platform_settings?: AgentPlatformSettingsRequestModel | null;
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
};

import type { ConversationalConfigAPIModel_Input } from "./ConversationalConfigAPIModel-Input.js";
import type { AgentPlatformSettingsRequestModel } from "./AgentPlatformSettingsRequestModel.js";
import type { AgentWorkflowRequestModel } from "./AgentWorkflowRequestModel.js";
export type AdhocAgentConfigOverrideForTestRequestModel = {
  conversation_config: ConversationalConfigAPIModel_Input;
  platform_settings: AgentPlatformSettingsRequestModel;
  workflow?: AgentWorkflowRequestModel | null;
};

import type { ConversationHistoryTranscriptToolCallCommonModel_Input } from "./ConversationHistoryTranscriptToolCallCommonModel-Input.js";
import type { ConversationHistoryTranscriptOtherToolsResultCommonModel } from "./ConversationHistoryTranscriptOtherToolsResultCommonModel.js";
import type { ConversationHistoryTranscriptSystemToolResultCommonModel_Input } from "./ConversationHistoryTranscriptSystemToolResultCommonModel-Input.js";
import type { ConversationHistoryTranscriptApiIntegrationWebhookToolsResultCommonModel_Input } from "./ConversationHistoryTranscriptApiIntegrationWebhookToolsResultCommonModel-Input.js";
import type { ConversationHistoryTranscriptWorkflowToolsResultCommonModel_Input } from "./ConversationHistoryTranscriptWorkflowToolsResultCommonModel-Input.js";
export type WorkflowToolNestedToolsStepModel_Input = {
  step_latency_secs: number;
  /**
   * @default "nested_tools"
   */
  type?: "nested_tools";
  node_id: string;
  requests: Array<ConversationHistoryTranscriptToolCallCommonModel_Input>;
  results: Array<
    | ConversationHistoryTranscriptOtherToolsResultCommonModel
    | ConversationHistoryTranscriptSystemToolResultCommonModel_Input
    | ConversationHistoryTranscriptApiIntegrationWebhookToolsResultCommonModel_Input
    | ConversationHistoryTranscriptWorkflowToolsResultCommonModel_Input
  >;
  is_successful: boolean;
};

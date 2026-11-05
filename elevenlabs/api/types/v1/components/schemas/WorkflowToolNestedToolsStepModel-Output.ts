import type { ConversationHistoryTranscriptToolCallCommonModel_Output } from "./ConversationHistoryTranscriptToolCallCommonModel-Output.js";
import type { ConversationHistoryTranscriptOtherToolsResultCommonModel } from "./ConversationHistoryTranscriptOtherToolsResultCommonModel.js";
import type { ConversationHistoryTranscriptSystemToolResultCommonModel_Output } from "./ConversationHistoryTranscriptSystemToolResultCommonModel-Output.js";
import type { ConversationHistoryTranscriptApiIntegrationWebhookToolsResultCommonModel_Output } from "./ConversationHistoryTranscriptApiIntegrationWebhookToolsResultCommonModel-Output.js";
import type { ConversationHistoryTranscriptWorkflowToolsResultCommonModel_Output } from "./ConversationHistoryTranscriptWorkflowToolsResultCommonModel-Output.js";
export type WorkflowToolNestedToolsStepModel_Output = {
  step_latency_secs: number;
  /**
   * @default "nested_tools"
   */
  type?: "nested_tools";
  node_id: string;
  requests: Array<ConversationHistoryTranscriptToolCallCommonModel_Output>;
  results: Array<
    | ConversationHistoryTranscriptOtherToolsResultCommonModel
    | ConversationHistoryTranscriptSystemToolResultCommonModel_Output
    | ConversationHistoryTranscriptApiIntegrationWebhookToolsResultCommonModel_Output
    | ConversationHistoryTranscriptWorkflowToolsResultCommonModel_Output
  >;
  is_successful: boolean;
};

import type { AgentMetadata } from "./AgentMetadata.js";
import type { ConversationHistoryMultivoiceMessageModel } from "./ConversationHistoryMultivoiceMessageModel.js";
import type { ConversationHistoryTranscriptToolCallCommonModel_Output } from "./ConversationHistoryTranscriptToolCallCommonModel-Output.js";
import type { ConversationHistoryTranscriptOtherToolsResultCommonModel } from "./ConversationHistoryTranscriptOtherToolsResultCommonModel.js";
import type { ConversationHistoryTranscriptSystemToolResultCommonModel_Output } from "./ConversationHistoryTranscriptSystemToolResultCommonModel-Output.js";
import type { ConversationHistoryTranscriptApiIntegrationWebhookToolsResultCommonModel_Output } from "./ConversationHistoryTranscriptApiIntegrationWebhookToolsResultCommonModel-Output.js";
import type { ConversationHistoryTranscriptWorkflowToolsResultCommonModel_Output } from "./ConversationHistoryTranscriptWorkflowToolsResultCommonModel-Output.js";
import type { UserFeedback } from "./UserFeedback.js";
import type { ConversationTurnMetrics } from "./ConversationTurnMetrics.js";
import type { RagRetrievalInfo } from "./RagRetrievalInfo.js";
import type { LLMUsage_Output } from "./LLMUsage-Output.js";
import type { TranscriptPlatformEvent } from "./TranscriptPlatformEvent.js";
import type { ConversationReasoningModel } from "./ConversationReasoningModel.js";
import type { ChatSourceMedium } from "./ChatSourceMedium.js";
import type { TriggeredGuardrailCommonModel } from "./TriggeredGuardrailCommonModel.js";
export type ConversationHistoryTranscriptCommonModel_Output = {
  role: "user" | "agent";
  agent_metadata?: AgentMetadata | null;
  message?: string | null;
  multivoice_message?: ConversationHistoryMultivoiceMessageModel | null;
  tool_calls?: Array<ConversationHistoryTranscriptToolCallCommonModel_Output>;
  tool_results?: Array<
    | ConversationHistoryTranscriptOtherToolsResultCommonModel
    | ConversationHistoryTranscriptSystemToolResultCommonModel_Output
    | ConversationHistoryTranscriptApiIntegrationWebhookToolsResultCommonModel_Output
    | ConversationHistoryTranscriptWorkflowToolsResultCommonModel_Output
  >;
  feedback?: UserFeedback | null;
  llm_override?: string | null;
  producing_llm?: string | null;
  time_in_call_secs: number;
  conversation_turn_metrics?: ConversationTurnMetrics | null;
  rag_retrieval_info?: RagRetrievalInfo | null;
  llm_usage?: LLMUsage_Output | null;
  /**
   * @default false
   */
  interrupted?: boolean;
  /**
   * @default false
   */
  ignored_as_backchannel?: boolean;
  platform_event?: TranscriptPlatformEvent | null;
  original_message?: string | null;
  reasoning?: Array<ConversationReasoningModel>;
  source_medium?: ChatSourceMedium | null;
  source_event_id?: number | null;
  used_static_kb_document_ids?: Array<string>;
  user_identifier?: string | null;
  id?: string | null;
  triggered_guardrails?: Array<TriggeredGuardrailCommonModel>;
};

import type { EvaluationSuccessResult } from "./EvaluationSuccessResult.js";
import type { ConversationInitiationSource } from "./ConversationInitiationSource.js";
import type { TelephonyDirection } from "./TelephonyDirection.js";
import type { ConversationSentimentAnalysis } from "./ConversationSentimentAnalysis.js";
import type { EvaluationCriteriaSummaryResult } from "./EvaluationCriteriaSummaryResult.js";
export type ConversationSummaryResponseModel = {
  agent_id: string;
  branch_id?: string | null;
  version_id?: string | null;
  agent_name?: string | null;
  conversation_id: string;
  start_time_unix_secs: number;
  call_duration_secs: number;
  /**
   * Total cost of the conversation in credits.
   */
  cost?: number | null;
  /**
   * Total fiat cost of the conversation in USD. `None` for conversations that predate fiat cost tracking.
   */
  cost_fiat?: number | null;
  /**
   * Number of transcript turns with text; tool-only turns are not counted.
   */
  message_count: number;
  /**
   * Number of user transcript turns with text; tool-only turns are not counted. `null` for older conversations before this field whose transcript was deleted.
   */
  user_message_count?: number | null;
  /**
   * Number of agent transcript turns with text; tool-only turns are not counted. `null` for older conversations before this field whose transcript was deleted.
   */
  agent_message_count?: number | null;
  status: "initiated" | "in-progress" | "processing" | "done" | "failed";
  /**
   * @default ""
   */
  termination_reason?: string;
  call_successful: EvaluationSuccessResult;
  call_success_score?: number | null;
  transcript_summary?: string | null;
  call_summary_title?: string | null;
  main_language?: string | null;
  conversation_initiation_source?: ConversationInitiationSource | null;
  tool_names?: Array<string> | null;
  direction?: TelephonyDirection | null;
  rating?: number | null;
  sentiment_analysis?: ConversationSentimentAnalysis | null;
  data_collection_results?: { [key: string]: unknown } | null;
  evaluation_criteria_results?: {
    [key: string]: EvaluationCriteriaSummaryResult;
  } | null;
  /**
   * Conversation tag ids assigned to this conversation.
   */
  tag_ids?: Array<string>;
};

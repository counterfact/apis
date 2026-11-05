import type { ConversationHistoryMetadataCommonModel } from "./ConversationHistoryMetadataCommonModel.js";
import type { ConversationHistoryAnalysisCommonModel } from "./ConversationHistoryAnalysisCommonModel.js";
import type { VisitedAgentRef } from "./VisitedAgentRef.js";
import type { ConversationInitiationClientDataRequest_Output } from "./ConversationInitiationClientDataRequest-Output.js";
import type { ConversationHistoryTranscriptResponseModel } from "./ConversationHistoryTranscriptResponseModel.js";
/**
 * @example {"agent_id":"agent_3701k3ttaq12ewp8b7qv5rfyszkz","agent_name":"My agent","conversation_id":"conv_7401k5m9x2p8ec3rqv6dtnhb0fzw","environment":"production","has_audio":true,"has_auxiliary_audio":true,"has_response_audio":true,"has_user_audio":true,"metadata":{"call_duration_secs":10,"start_time_unix_secs":1714423232},"status":"processing","tag_ids":[],"transcript":[{"message":"Hello, how are you?","role":"user","time_in_call_secs":10}],"version_id":"agtvrsn_5xM3yVvZQKV0EfqQpLr2"}
 */
export type GetConversationResponseModel = {
  agent_id: string;
  agent_name?: string | null;
  /**
   * @default "agent"
   */
  conversation_product?: string;
  status: "initiated" | "in-progress" | "processing" | "done" | "failed";
  user_id?: string | null;
  branch_id?: string | null;
  /**
   * The ID of the agent version used for this conversation
   */
  version_id?: string | null;
  metadata: ConversationHistoryMetadataCommonModel;
  analysis?: ConversationHistoryAnalysisCommonModel | null;
  /**
   * Number of user transcript turns with text; tool-only turns are not counted. `null` for older conversations before this field whose transcript was deleted.
   */
  user_message_count?: number | null;
  /**
   * Number of agent transcript turns with text; tool-only turns are not counted. `null` for older conversations before this field whose transcript was deleted.
   */
  agent_message_count?: number | null;
  visited_agents?: Array<VisitedAgentRef>;
  conversation_initiation_client_data?: ConversationInitiationClientDataRequest_Output;
  /**
   * @default "production"
   */
  environment?: string;
  conversation_id: string;
  has_audio: boolean;
  has_user_audio: boolean;
  has_response_audio: boolean;
  has_auxiliary_audio: boolean;
  transcript: Array<ConversationHistoryTranscriptResponseModel>;
  /**
   * Conversation tag ids assigned to this conversation.
   */
  tag_ids?: Array<string>;
  /**
   * OpenTelemetry trace payload when the request uses format=opentelemetry; otherwise omitted.
   */
  otlp_traces?: { [key: string]: unknown } | null;
};

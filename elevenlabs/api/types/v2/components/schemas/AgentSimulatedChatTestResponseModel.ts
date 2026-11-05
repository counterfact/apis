import type { ConversationHistoryTranscriptResponseModel } from "./ConversationHistoryTranscriptResponseModel.js";
import type { ConversationHistoryAnalysisCommonModel } from "./ConversationHistoryAnalysisCommonModel.js";
export type AgentSimulatedChatTestResponseModel = {
  simulated_conversation: Array<ConversationHistoryTranscriptResponseModel>;
  analysis: ConversationHistoryAnalysisCommonModel;
};

import type { ConversationHistoryTranscriptCommonModel_Output } from "./ConversationHistoryTranscriptCommonModel-Output.js";
export type TestFromConversationMetadata_Output = {
  conversation_id: string;
  agent_id: string;
  branch_id?: string | null;
  workflow_node_id?: string | null;
  /**
   * @default []
   */
  original_agent_reply?: Array<ConversationHistoryTranscriptCommonModel_Output>;
};

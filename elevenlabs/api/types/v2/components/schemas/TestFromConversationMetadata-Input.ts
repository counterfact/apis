import type { ConversationHistoryTranscriptCommonModel_Input } from "./ConversationHistoryTranscriptCommonModel-Input.js";
export type TestFromConversationMetadata_Input = {
  conversation_id: string;
  agent_id: string;
  branch_id?: string | null;
  workflow_node_id?: string | null;
  /**
   * @default []
   */
  original_agent_reply?: Array<ConversationHistoryTranscriptCommonModel_Input>;
};

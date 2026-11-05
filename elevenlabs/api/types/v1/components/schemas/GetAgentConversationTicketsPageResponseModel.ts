import type { AgentConversationTicketResponseModel } from "./AgentConversationTicketResponseModel.js";
export type GetAgentConversationTicketsPageResponseModel = {
  agent_conversation_tickets: Array<AgentConversationTicketResponseModel>;
  next_cursor?: string | null;
  has_more: boolean;
};

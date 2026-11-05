import type { AgentConversationTicketStatus } from "./AgentConversationTicketStatus.js";
export type TicketStatusChangeResponseModel = {
  status: AgentConversationTicketStatus;
  changed_by_user_id: string | null;
  changed_at_unix_secs: number;
};

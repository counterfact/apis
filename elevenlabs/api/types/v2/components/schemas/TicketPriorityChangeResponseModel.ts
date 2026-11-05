import type { AgentConversationTicketPriority } from "./AgentConversationTicketPriority.js";
export type TicketPriorityChangeResponseModel = {
  priority: AgentConversationTicketPriority | null;
  changed_by_user_id: string;
  changed_at_unix_secs: number;
};

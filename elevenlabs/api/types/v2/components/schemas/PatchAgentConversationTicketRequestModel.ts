import type { AgentConversationTicketStatus } from "./AgentConversationTicketStatus.js";
import type { AgentConversationTicketPriority } from "./AgentConversationTicketPriority.js";
export type PatchAgentConversationTicketRequestModel = {
  /**
   * If provided, updates the ticket title. Omit to leave unchanged.
   */
  title?: string | null;
  /**
   * If provided, updates the ticket description. Omit to leave unchanged.
   */
  qa_comment?: string | null;
  /**
   * If provided, updates the ticket status. Omit to leave unchanged.
   */
  status?: AgentConversationTicketStatus | null;
  /**
   * If provided, updates who is responsible for resolving this ticket. Must be a workspace member with at least viewer access to the agent. Pass null to unassign. Omit to leave unchanged.
   */
  assignee_user_id?: string | null;
  /**
   * If provided, updates how urgently the ticket needs attention. Pass null to clear it. Omit to leave unchanged.
   */
  priority?: AgentConversationTicketPriority | null;
};

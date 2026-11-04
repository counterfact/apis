import type { AgentConversationTicketPriority } from "./AgentConversationTicketPriority.js";
export type CreateManualTicketRequestModel = {
  /**
   * One-line headline shown in the triage list. Defaults to one derived from qa_comment.
   */
  title?: string | null;
  /**
   * What the ticket is about, e.g. a follow-up task for the agent.
   */
  qa_comment: string;
  /**
   * How urgently the ticket needs attention.
   */
  priority?: AgentConversationTicketPriority | null;
};

import type { TurnCommentRequestModel } from "./TurnCommentRequestModel.js";
import type { AgentConversationTicketPriority } from "./AgentConversationTicketPriority.js";
export type CreateAgentConversationTicketRequestModel = {
  /**
   * Conversation this ticket is about.
   */
  conversation_id: string;
  /**
   * One-line headline shown in the triage list. Defaults to one derived from the comments, falling back to the conversation's summary title. Ignored when the comment is added to the conversation's open ticket.
   */
  title?: string | null;
  /**
   * The issue this ticket is about, covering the whole conversation rather than a single turn.
   */
  qa_comment?: string | null;
  /**
   * Optional turn-level comments on what went wrong.
   */
  turn_comments?: Array<TurnCommentRequestModel>;
  /**
   * How urgently the ticket needs attention. If the conversation already has an open ticket, it is raised to this priority when lower.
   */
  priority?: AgentConversationTicketPriority | null;
};

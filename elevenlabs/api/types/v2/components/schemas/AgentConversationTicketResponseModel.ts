import type { AgentConversationTicketIssueType } from "./AgentConversationTicketIssueType.js";
import type { TicketCommentResponseModel } from "./TicketCommentResponseModel.js";
import type { TurnCommentResponseModel } from "./TurnCommentResponseModel.js";
import type { AgentConversationTicketStatus } from "./AgentConversationTicketStatus.js";
import type { AgentConversationTicketPriority } from "./AgentConversationTicketPriority.js";
import type { TicketPriorityChangeResponseModel } from "./TicketPriorityChangeResponseModel.js";
import type { TicketStatusChangeResponseModel } from "./TicketStatusChangeResponseModel.js";
import type { AgentConversationTicketSource } from "./AgentConversationTicketSource.js";
import type { TicketSearchMatchResponseModel } from "./TicketSearchMatchResponseModel.js";
export type AgentConversationTicketResponseModel = {
  agentqa_ticket_id: string;
  workspace_id: string;
  owner_user_id: string;
  agent_id: string;
  needs_clustering: boolean;
  /**
   * One-line headline for the ticket. None only on tickets created before titles existed.
   */
  title: string | null;
  issue_type: AgentConversationTicketIssueType | null;
  labels: Array<string>;
  conversation_ids: Array<string>;
  first_seen_unix_secs: number | null;
  last_seen_unix_secs: number | null;
  qa_comment: string | null;
  ticket_comments: Array<TicketCommentResponseModel>;
  turn_comments: Array<TurnCommentResponseModel>;
  status: AgentConversationTicketStatus;
  priority: AgentConversationTicketPriority | null;
  priority_changes: Array<TicketPriorityChangeResponseModel>;
  status_changes: Array<TicketStatusChangeResponseModel>;
  /**
   * The ticket this one was merged into, set while its status is 'merged'.
   */
  merged_into_ticket_id?: string | null;
  source: AgentConversationTicketSource;
  assignee_user_id: string | null;
  created_at_unix_secs: number;
  updated_at_unix_secs: number;
  /**
   * Where the list's `search` query matched. Set only on searched lists.
   */
  search_match?: TicketSearchMatchResponseModel | null;
};

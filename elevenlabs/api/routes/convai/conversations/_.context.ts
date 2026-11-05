import type { GetConversationResponseModel as Conversation } from "../../../types/v1/components/schemas/GetConversationResponseModel.js";
import type { ConversationSummaryResponseModel as Summary } from "../../../types/v1/components/schemas/ConversationSummaryResponseModel.js";
import type { ConversationTagResponseModel as Tag } from "../../../types/v1/components/schemas/ConversationTagResponseModel.js";
import type { SIPLogMessage } from "../../../types/v1/components/schemas/SIPLogMessage.js";
import type { HTTP_GET_Query as ListQuery } from "../../../types/v1/paths/convai/conversations.types.js";
const object = (input: unknown): input is Record<string, unknown> => input !== null && typeof input === "object" && !Array.isArray(input);
export class ConversationError extends Error {
  override name = "ConversationError";
  constructor(public status: number, public code: string, message: string) { super(message); }
}
const invalid = (): never => { throw new ConversationError(400, "invalid_conversation_request", "Invalid or unsupported conversation request"); };
const integer = (value: unknown, min = 0, max = Number.MAX_SAFE_INTEGER): number | undefined => {
  if (value == null) return undefined;
  const number = typeof value === "string" && /^\d+$/.test(value) ? Number(value) : value;
  if (typeof number !== "number" || !Number.isSafeInteger(number) || number < min || number > max) return invalid();
  return number;
};
const bool = (value: unknown): boolean | undefined => {
  if (value == null) return undefined;
  if (typeof value === "boolean") return value;
  if (value === "true" || value === "false") return value === "true";
  return invalid();
};
const matches = (values: string[] | null | undefined, candidate: string | null | undefined) => values == null || values.includes(candidate ?? "");
const page = <T>(values: T[], size: number, cursor: unknown, max: number) => {
  integer(size, 1, max);
  if (cursor != null && (typeof cursor !== "string" || !/^\d+$/.test(cursor))) return invalid();
  const offset = integer(cursor) ?? 0;
  const has_more = offset + size < values.length;
  return { items: structuredClone(values.slice(offset, offset + size)), next_cursor: has_more ? String(offset + size) : null, has_more };
};
export class Context {
  conversations = new Map<string, Conversation>();
  sipMessages = new Map<string, SIPLogMessage[]>();
  references = new Map<string, string>();
  workspaceId = "";
  tag: (id: string) => Tag | undefined = () => undefined;

  private stored(id: string) {
    const conversation = this.conversations.get(id);
    if (!conversation) throw new ConversationError(404, "conversation_not_found", "Conversation not found");
    return conversation;
  }
  private tagIds(conversation: Conversation) {
    return (conversation.tag_ids ?? []).filter(id => this.tag(id)?.workspace_id === this.workspaceId);
  }
  getConversation(id: string, format = "json") {
    if (format !== "json") return invalid();
    const result = structuredClone(this.stored(id));
    result.tag_ids = this.tagIds(result);
    return result;
  }
  resolveConversation(agentId: string, reference: string) {
    let url: URL;
    try { url = new URL(reference); } catch { return invalid(); }
    if (url.protocol !== "https:" || url.username || url.password || !(
      /(^|\.)zendesk\.com$/.test(url.hostname) && /^\/agent\/tickets\/\d+\/?$/.test(url.pathname) ||
      /(^|\.)slack\.com$/.test(url.hostname) && /^\/archives\/[^/]+\/p\d+\/?$/.test(url.pathname))) return invalid();
    const id = this.references.get(`${agentId}\n${url.href}`);
    if (!id) throw new ConversationError(404, "conversation_not_found", "Conversation reference not found");
    return this.getConversation(id);
  }
  summary(id: string, maxMessages = 40) {
    integer(maxMessages, 1, 200);
    const conversation = this.stored(id);
    const messages = conversation.transcript.filter(turn => typeof turn.message === "string" && turn.message.length > 0 && !turn.contextual_update_info)
      .map(turn => ({ role: turn.role, message: turn.message! }));
    const omitted = messages.length > maxMessages;
    return { conversation_id: id, agent_id: conversation.agent_id, status: conversation.status,
      call_summary_title: conversation.analysis?.call_summary_title ?? null, transcript_summary: conversation.analysis?.transcript_summary ?? null,
      call_successful: conversation.analysis?.call_successful ?? null, message_count: messages.length,
      messages: omitted ? null : messages, messages_omitted: omitted,
      note: omitted ? `Fetch /v1/convai/conversations/${id} for the full transcript.` : "Plain chat messages only; see the full transcript for tool details." };
  }
  private listItem(conversation: Conversation, includeSummary: boolean): Summary {
    const messages = this.summary(conversation.conversation_id);
    return { conversation_id: conversation.conversation_id, agent_id: conversation.agent_id, agent_name: conversation.agent_name,
      branch_id: conversation.branch_id, version_id: conversation.version_id, status: conversation.status,
      start_time_unix_secs: conversation.metadata.start_time_unix_secs, call_duration_secs: conversation.metadata.call_duration_secs,
      cost: conversation.metadata.cost, cost_fiat: conversation.metadata.cost_fiat, message_count: messages.message_count,
      user_message_count: conversation.transcript.filter(turn => turn.role === "user" && !!turn.message && !turn.contextual_update_info).length,
      agent_message_count: conversation.transcript.filter(turn => turn.role === "agent" && !!turn.message && !turn.contextual_update_info).length,
      call_successful: conversation.analysis?.call_successful ?? "unknown", call_success_score: conversation.analysis?.call_success_score,
      ...(includeSummary ? { transcript_summary: conversation.analysis?.transcript_summary ?? null, call_summary_title: conversation.analysis?.call_summary_title ?? null } : {}),
      main_language: conversation.metadata.main_language, conversation_initiation_source: conversation.metadata.conversation_initiation_source,
      rating: conversation.metadata.feedback?.rating, termination_reason: conversation.metadata.termination_reason,
      tag_ids: this.tagIds(conversation) };
  }
  listConversations(query: ListQuery = {}) {
    // Counterfact #2615 preserves a single array query value as a string.
    const arrays = ["visited_agent_ids", "visited_agent_branch_ids", "main_languages", "exclude_statuses", "tag_ids", "termination_reasons"];
    query = Object.fromEntries(Object.entries(query).map(([key, value]) => {
      if (!arrays.includes(key) || value == null) return [key, value];
      const values = typeof value === "string" ? [value] : value;
      if (!Array.isArray(values) || values.some(item => typeof item !== "string") || key.startsWith("visited_") && values.length > 50) return invalid();
      return [key, values];
    })) as ListQuery;
    const unsupported: Array<keyof ListQuery> = ["triggered_procedure_ids", "evaluation_params", "data_collection_params", "dynamic_variable_params", "data_collection_filter", "dynamic_variable_filter", "data_collection_ids", "evaluation_criteria_ids", "tool_names", "tool_names_successful", "tool_names_errored", "parent_conversation_id", "topic_ids", "workflow_node_entered_id", "guardrail_types", "custom_guardrail_names"];
    if (unsupported.some(key => query[key] != null) || query.include_invalid_tool_calls === true) return invalid();
    if (query.sort_direction != null && !["asc", "desc"].includes(query.sort_direction) || query.summary_mode != null && !["include", "exclude"].includes(query.summary_mode)) return invalid();
    const before = integer(query.call_start_before_unix), after = integer(query.call_start_after_unix);
    const minDuration = integer(query.call_duration_min_secs), maxDuration = integer(query.call_duration_max_secs);
    const minRating = integer(query.rating_min, 1, 5), maxRating = integer(query.rating_max, 1, 5);
    if (before !== undefined && after !== undefined && before < after || minDuration !== undefined && maxDuration !== undefined && minDuration > maxDuration || minRating !== undefined && maxRating !== undefined && minRating > maxRating) return invalid();
    const textOnly = bool(query.text_only), hasComment = bool(query.has_feedback_comment);
    const values = [...this.conversations.values()].filter(c => {
      const metadata = c.metadata, rating = metadata.feedback?.rating;
      return (query.agent_id == null || c.agent_id === query.agent_id) && (query.user_id == null || c.user_id === query.user_id) &&
        (query.branch_id == null || c.branch_id === query.branch_id) && (query.version_id == null || c.version_id === query.version_id) &&
        (query.conversation_product_type == null || c.conversation_product === query.conversation_product_type) &&
        (query.conversation_initiation_source == null || metadata.conversation_initiation_source === query.conversation_initiation_source) &&
        (query.call_successful == null || (c.analysis?.call_successful ?? "unknown") === query.call_successful) &&
        (before === undefined || metadata.start_time_unix_secs <= before) && (after === undefined || metadata.start_time_unix_secs >= after) &&
        (minDuration === undefined || metadata.call_duration_secs >= minDuration) && (maxDuration === undefined || metadata.call_duration_secs <= maxDuration) &&
        (minRating === undefined || rating != null && rating >= minRating) && (maxRating === undefined || rating != null && rating <= maxRating) &&
        (textOnly === undefined || (metadata.text_only ?? false) === textOnly) && (hasComment === undefined || !!metadata.feedback?.comment === hasComment) &&
        matches(query.main_languages, metadata.main_language) && matches(query.termination_reasons, metadata.termination_reason) &&
        (query.exclude_statuses == null || !query.exclude_statuses.includes(c.status)) &&
        (query.tag_ids == null || query.tag_ids.some(id => this.tagIds(c).includes(id))) &&
        (query.visited_agent_ids == null || query.visited_agent_ids.some(id => c.agent_id === id || c.visited_agents?.some(a => a.agent_id === id))) &&
        (query.visited_agent_branch_ids == null || query.visited_agent_branch_ids.some(id => c.branch_id === id || c.visited_agents?.some(a => a.branch_id === id))) &&
        (query.search == null || c.transcript.some(turn => turn.message?.toLowerCase().includes(query.search!.toLowerCase())));
    });
    const direction = query.sort_direction === "asc" ? 1 : -1;
    values.sort((a,b) => direction * (a.metadata.start_time_unix_secs - b.metadata.start_time_unix_secs) || a.conversation_id.localeCompare(b.conversation_id));
    const result = page(values.map(c => this.listItem(c, query.summary_mode === "include")), query.page_size ?? 30, query.cursor, 100);
    return { conversations: result.items, has_more: result.has_more, next_cursor: result.next_cursor };
  }
  setFeedback(id: string, input: unknown) {
    const conversation = this.stored(id);
    if (!object(input) || Object.keys(input).some(key => key !== "feedback") || input.feedback != null && (typeof input.feedback !== "string" || !["like", "dislike"].includes(input.feedback))) return invalid();
    if ("feedback" in input) conversation.metadata.feedback = { ...conversation.metadata.feedback, type: "thumbs", overall_score: input.feedback as "like" | "dislike" | null,
      likes: input.feedback === "like" ? 1 : 0, dislikes: input.feedback === "dislike" ? 1 : 0 };
    return {};
  }
  assignTags(id: string, input: unknown) {
    const conversation = this.stored(id);
    if (!object(input) || Object.keys(input).length !== 1 || !Array.isArray(input.tag_ids) || input.tag_ids.length < 1 || input.tag_ids.length > 50 || input.tag_ids.some(id => typeof id !== "string")) return invalid();
    for (const id of input.tag_ids) {
      const tag = this.tag(id);
      if (!tag || tag.workspace_id !== this.workspaceId) throw new ConversationError(404, "conversation_tag_not_found", "Conversation tag not found in this workspace");
    }
    conversation.tag_ids = [...new Set([...(conversation.tag_ids ?? []), ...input.tag_ids as string[]])];
  }
  removeTag(id: string, tagId: string) {
    const conversation = this.stored(id);
    conversation.tag_ids = (conversation.tag_ids ?? []).filter(id => id !== tagId);
  }
  listSipMessages(id: string, query: {page_size?: number; cursor?: string | null} = {}) {
    this.stored(id);
    const values = [...this.sipMessages.get(id) ?? []].sort((a,b) => b.created_at_unix_micro - a.created_at_unix_micro || a.call_id.localeCompare(b.call_id));
    const result = page(values, query.page_size ?? 20, query.cursor, 20);
    return { sip_messages: result.items, next_cursor: result.next_cursor, has_more: result.has_more };
  }
  deleteConversation(id: string) {
    this.stored(id);
    this.conversations.delete(id);
    this.sipMessages.delete(id);
    for (const [key, value] of this.references) if (value === id) this.references.delete(key);
    return {};
  }
}

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
  agents?: () => Map<string, import("../agents/_.context.js").StoredAgent>;
  smartMatches = new Map<string, {conversationId:string;index:number;text:string;score:number}[]>();
  analysisDefinitions?:()=>Map<string,string>;
  analysisFixtureVersions=new Map<string,string>();
  analysisFixtures = new Map<string, NonNullable<Conversation["analysis"]>>();
  liveCount(query:Record<string,unknown>={}) {
    const ids=query.agent_ids==null?null:typeof query.agent_ids==="string"?[query.agent_ids]:query.agent_ids;
    if(ids!==null&&(!Array.isArray(ids)||ids.some(x=>typeof x!=="string"))||query.agent_id!=null&&typeof query.agent_id!=="string")return invalid();
    return {count:[...this.conversations.values()].filter(c=>["initiated","in-progress"].includes(c.status)&&(ids?ids.includes(c.agent_id):query.agent_id==null||c.agent_id===query.agent_id)).length};
  }
  searchMessages(input:Record<string,unknown>,smart=false) {
    const {text_query,sort_by="search_score",cursor,page_size=20,...filters}=input;
    if(typeof text_query!=="string"||!text_query.trim()||!["search_score","created_at"].includes(String(sort_by)))return invalid();
    integer(page_size,1,50);
    if(smart&&Object.keys(filters).some(k=>!["agent_id","branch_id"].includes(k)))return invalid();
    const supported=["agent_id","branch_id","version_id","user_id","visited_agent_ids","visited_agent_branch_ids","call_successful","call_start_before_unix","call_start_after_unix","call_duration_min_secs","call_duration_max_secs","rating_min","rating_max","has_feedback_comment","main_languages","exclude_statuses","termination_reasons","summary_mode","conversation_initiation_source","text_only","conversation_product_type","include_invalid_tool_calls"];
    if(Object.keys(filters).some(k=>!supported.includes(k))||filters.summary_mode==="include")return invalid();
    // Reuse the existing validated conversation-filter semantics before message ranking.
    const allowed=new Set<string>();let next:string|null|undefined=null;
    do {const result=this.listConversations({...filters,page_size:100,cursor:next} as ListQuery);for(const c of result.conversations)allowed.add(c.conversation_id);next=result.next_cursor;}while(next!=null);
    const rows:import("../../../types/v1/components/schemas/MessagesSearchResult.js").MessagesSearchResult[]=[];
    if(smart) for(const match of this.smartMatches.get(text_query)??[]){const c=this.conversations.get(match.conversationId),turn=c?.transcript[match.index];if(!c||!allowed.has(c.conversation_id)||turn?.message!==match.text||turn.contextual_update_info)continue;rows.push({conversation_id:c.conversation_id,agent_id:c.agent_id,agent_name:c.agent_name,transcript_index:match.index,chunk_text:match.text,chunk_highlights:null,score:match.score,conversation_start_time_unix_secs:c.metadata.start_time_unix_secs});}
    else for(const c of this.conversations.values())if(allowed.has(c.conversation_id))for(const [index,turn]of c.transcript.entries()){
      if(!turn.message||turn.contextual_update_info)continue;const text=turn.message,query=text_query.toLowerCase(),at=text.toLowerCase().indexOf(query);if(at<0)continue;
      rows.push({conversation_id:c.conversation_id,agent_id:c.agent_id,agent_name:c.agent_name,transcript_index:index,chunk_text:text,chunk_highlights:[{value:text.slice(0,at),is_hit:false},{value:text.slice(at,at+query.length),is_hit:true},{value:text.slice(at+query.length),is_hit:false}].filter(x=>x.value),score:query.length/text.length,conversation_start_time_unix_secs:c.metadata.start_time_unix_secs});
    }
    rows.sort((a,b)=>(sort_by==="created_at"?b.conversation_start_time_unix_secs-a.conversation_start_time_unix_secs:b.score-a.score)||a.conversation_id.localeCompare(b.conversation_id)||a.transcript_index-b.transcript_index);
    const result=page(rows,Number(page_size),cursor,50);return {results:result.items,has_more:result.has_more,next_cursor:result.next_cursor};
  }
  runAnalysis(id:string,input?:unknown) {
    const conversation=this.stored(id),agent=this.agents?.().get(conversation.agent_id);
    if(!agent)throw new ConversationError(404,"agent_not_found","Agent not found");
    if(!["done","failed"].includes(conversation.status))throw new ConversationError(409,"conversation_not_complete","Conversation is not complete");
    if(input!==undefined&&(!object(input)||Object.keys(input).some(k=>!["evaluation_id","scope"].includes(k))||typeof input.evaluation_id!=="string"||input.scope!=null&&!["conversation","agent"].includes(String(input.scope))))return invalid();
    const refs=agent.configuration.platform_settings?.analysis_items;
    const evaluations=(refs?.evaluation_criteria??[]).map(r=>r.analysis_item_id),data=(refs?.data_collection??[]).map(r=>r.analysis_item_id);
    const legacy=agent.configuration.platform_settings;
    if((legacy?.evaluation?.criteria?.length??0)>0||Object.keys(legacy?.data_collection??{}).length>0)throw new ConversationError(400,"unsupported_legacy_analysis","Only attached analysis-item fixtures are supported");
    const fixture=this.analysisFixtures.get(id);
    if(!fixture)throw new ConversationError(409,"analysis_fixture_unavailable","No synthetic analysis fixture is configured");
    const selected=input as {evaluation_id:string;scope?:"conversation"|"agent"}|undefined;
    if(selected&&!evaluations.includes(selected.evaluation_id))throw new ConversationError(404,"evaluation_not_found","Evaluation is not attached to the current agent");
    const ids=selected?[selected.evaluation_id]:evaluations;
    const definitions=this.analysisDefinitions?.()??new Map();
    for(const key of [...ids,...(selected?[]:data)]){
      if(!definitions.has(key))throw new ConversationError(404,"analysis_item_not_found","Current analysis item not found");
      if(definitions.get(key)!==this.analysisFixtureVersions.get(key))throw new ConversationError(409,"analysis_fixture_stale","No fixture for current analysis definition version");
    }
    if(ids.some(key=>!fixture.evaluation_criteria_results?.[key])||!selected&&data.some(key=>!fixture.data_collection_results?.[key]))throw new ConversationError(409,"analysis_fixture_unavailable","No synthetic criterion result is configured");
    const next=structuredClone(conversation.analysis??{call_successful:"unknown" as const,transcript_summary:""});
    const results=Object.fromEntries(ids.map(key=>[key,structuredClone(fixture.evaluation_criteria_results![key]!)]));
    if(selected?.scope==="agent"){
      const branchId=conversation.branch_id??agent.mainBranch?.id;
      const matchesScope=(s:NonNullable<typeof next.scoped>[number])=>s.scope==="agent"&&s.source_agent_id===conversation.agent_id&&(s.source_branch_id??branchId)===branchId;
      const previous=next.scoped?.find(matchesScope);
      next.scoped=[...(next.scoped??[]).filter(s=>!matchesScope(s)),{scope:"agent",source_agent_id:conversation.agent_id,source_branch_id:branchId,evaluation_criteria_results:{...previous?.evaluation_criteria_results,...results},data_collection_results:previous?.data_collection_results,successful:previous?.successful??fixture.call_successful}];
    }else if(selected){next.evaluation_criteria_results={...next.evaluation_criteria_results,...results};next.evaluation_criteria_results_list=Object.values(next.evaluation_criteria_results);}
    else {next.evaluation_criteria_results=results;next.evaluation_criteria_results_list=Object.values(results);next.data_collection_results=Object.fromEntries(data.map(key=>[key,structuredClone(fixture.data_collection_results![key]!) ]));next.data_collection_results_list=Object.values(next.data_collection_results);next.call_successful=fixture.call_successful;next.transcript_summary=fixture.transcript_summary;next.call_summary_title=fixture.call_summary_title;}
    conversation.analysis=next;return this.getConversation(id);
  }

  conversations = new Map<string, Conversation>();
  audio = new Map<string, Uint8Array>();
  files = new Map<string, Map<string, import("../../../types/v1/components/schemas/ConversationHistoryTranscriptFileInputResponseModel.js").ConversationHistoryTranscriptFileInputResponseModel>>();
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
    // The retained fixture is one response track, never a recording of the user.
    result.has_audio = result.has_response_audio = (this.audio.get(id)?.length ?? 0) > 0;
    result.has_user_audio = result.has_auxiliary_audio = false;
    result.tag_ids = this.tagIds(result);
    return result;
  }
  getAudio(id: string, query: Record<string, unknown> = {}) {
    this.stored(id);
    if (Object.keys(query).length) return invalid();
    const audio = this.audio.get(id);
    if (!audio?.length) throw new ConversationError(409, "conversation_audio_unavailable", "No synthetic audio is retained for this conversation");
    return new Uint8Array(audio);
  }
  deleteFile(id: string, fileId: string) {
    const conversation = this.stored(id);
    const files = this.files.get(id);
    if (!files?.has(fileId)) throw new ConversationError(404, "conversation_file_not_found", "Conversation file not found");
    if (conversation.transcript.some(turn => turn.file_input?.file_id === fileId || turn.file_inputs?.some(file => file.file_id === fileId))) {
      throw new ConversationError(409, "conversation_file_in_use", "Historical transcript attachments cannot be removed");
    }
    files.delete(fileId);
    return {file_id: fileId};
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
    this.audio.delete(id);
    this.files.delete(id);
    this.sipMessages.delete(id);
    for (const [key, value] of this.references) if (value === id) this.references.delete(key);
    return {};
  }
}

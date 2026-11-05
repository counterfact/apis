import type { ToolResponseModel as Tool } from "../../../types/v1/components/schemas/ToolResponseModel.js";
import type { ToolExecutionResponseModel as Execution } from "../../../types/v1/components/schemas/ToolExecutionResponseModel.js";
import type { ToolsResponseModel } from "../../../types/v1/components/schemas/ToolsResponseModel.js";
import type { GetToolDependentAgentsResponseModel } from "../../../types/v1/components/schemas/GetToolDependentAgentsResponseModel.js";
import type { GetToolExecutionsPageResponseModel } from "../../../types/v1/components/schemas/GetToolExecutionsPageResponseModel.js";
import type { HTTP_GET_Query as ToolQuery } from "../../../types/v1/paths/convai/tools.types.js";
import type { HTTP_GET_Query as ExecutionQuery } from "../../../types/v1/paths/convai/tools/{tool_id}/executions.types.js";
import type { HTTP_GET_Query as DependentQuery } from "../../../types/v1/paths/convai/tools/{tool_id}/dependent-agents.types.js";
import type { StoredAgent } from "../agents/_.context.js";

type ErrorCode = "invalid_tool_query" | "tool_not_found" | "tool_in_use" | "unsupported_tool_force";
type Result<T> = { value: T; error?: never } | { error: ErrorCode; value?: never };
export type StoredTool = { configuration: Tool; creatorUserId: string; createdAt: number };
const keys = (query: object, allowed: string[]) => Object.keys(query).every(key => allowed.includes(key));
const optionalText = (value: unknown) => value == null || typeof value === "string";
function pagination(query: { page_size?: number | null; cursor?: string | null }): { offset: number; size: number } | undefined {
  const size = query.page_size ?? 30;
  const cursor = query.cursor ?? "0";
  if (!Number.isInteger(size) || size < 1 || size > 100 || typeof cursor !== "string" || !/^(0|[1-9][0-9]*)$/.test(cursor) || !Number.isSafeInteger(Number(cursor))) return undefined;
  return { offset: Number(cursor), size };
}
function page<T>(rows: T[], paging: { offset: number; size: number }) {
  const { offset, size } = paging;
  const has_more = offset + size < rows.length;
  return { rows: structuredClone(rows.slice(offset, offset + size)), next_cursor: has_more ? String(offset + size) : null, has_more };
}

export class Context {
  tools = new Map<string, StoredTool>();
  executions: Execution[] = [];
  agentsMap: () => Map<string, StoredAgent> = () => new Map();
  currentUserId?: string;

  getTool(id: string): Tool | undefined {
    const record = this.tools.get(id);
    return record ? structuredClone(record.configuration) : undefined;
  }
  private dependents(id: string) {
    return [...this.agentsMap().values()].filter(record => record.configuration.conversation_config.agent?.prompt?.tool_ids?.includes(id));
  }
  listTools(query: ToolQuery = {}): Result<ToolsResponseModel> {
    const paging = pagination(query);
    if (!paging || !keys(query, ["page_size", "cursor", "search", "show_only_owned_documents", "created_by_user_id", "types", "sort_direction", "sort_by", "used_by_agent_id"]) || !optionalText(query.search) || !optionalText(query.created_by_user_id) || !optionalText(query.used_by_agent_id) || query.show_only_owned_documents !== undefined && typeof query.show_only_owned_documents !== "boolean" || query.sort_by != null && !["name", "created_at"].includes(query.sort_by) || query.sort_direction !== undefined && !["asc", "desc"].includes(query.sort_direction) || query.types != null && (!Array.isArray(query.types) || query.types.some(type => !["client", "webhook", "api_integration_webhook"].includes(type)))) return { error: "invalid_tool_query" };
    const creator = query.created_by_user_id === "@me" || query.created_by_user_id == null && query.show_only_owned_documents ? this.currentUserId : query.created_by_user_id;
    const references = query.used_by_agent_id == null ? undefined : this.agentsMap().get(query.used_by_agent_id)?.configuration.conversation_config.agent?.prompt?.tool_ids ?? [];
    const rows = [...this.tools.values()].filter(record => {
      const config = record.configuration;
      return (query.search == null || config.tool_config.name.startsWith(query.search)) && (creator == null || record.creatorUserId === creator) && (query.types == null || query.types.some(type => type === config.tool_config.type)) && (references === undefined || references.includes(config.id));
    });
    const direction = query.sort_direction === "asc" ? 1 : -1;
    rows.sort((a, b) => direction * (query.sort_by === "name" ? a.configuration.tool_config.name.localeCompare(b.configuration.tool_config.name) : a.createdAt - b.createdAt) || a.configuration.id.localeCompare(b.configuration.id));
    const result = page(rows.map(record => record.configuration), paging);
    return { value: { tools: result.rows, next_cursor: result.next_cursor, has_more: result.has_more } };
  }
  deleteTool(id: string, force = false): Result<null> {
    if (force) return { error: "unsupported_tool_force" };
    if (!this.tools.has(id)) return { error: "tool_not_found" };
    if (this.dependents(id).length) return { error: "tool_in_use" };
    this.tools.delete(id);
    this.executions = this.executions.filter(execution => execution.tool_id !== id);
    return { value: null };
  }
  listDependents(id: string, query: DependentQuery = {}): Result<GetToolDependentAgentsResponseModel> {
    if (!this.tools.has(id)) return { error: "tool_not_found" };
    const paging = pagination(query);
    if (!paging || !keys(query, ["page_size", "cursor"])) return { error: "invalid_tool_query" };
    const rows = this.dependents(id).map(({ configuration: agent }) => ({ type: "available" as const, id: agent.agent_id, name: agent.name, created_at_unix_secs: agent.metadata.created_at_unix_secs, access_level: agent.access_info!.role })).sort((a, b) => a.id.localeCompare(b.id));
    const result = page(rows, paging);
    return { value: { agents: result.rows, branches: [], next_cursor: result.next_cursor, has_more: result.has_more } };
  }
  listExecutions(id: string, query: ExecutionQuery = {}): Result<GetToolExecutionsPageResponseModel> {
    if (!this.tools.has(id)) return { error: "tool_not_found" };
    const paging = pagination(query);
    if (!paging || !keys(query, ["page_size", "cursor", "is_error", "agent_id", "branch_id", "start_time", "end_time"]) || query.is_error != null && typeof query.is_error !== "boolean" || !optionalText(query.agent_id) || !optionalText(query.branch_id) || [query.start_time, query.end_time].some(value => value != null && (!Number.isSafeInteger(value) || value < 0)) || query.start_time != null && query.end_time != null && query.start_time > query.end_time) return { error: "invalid_tool_query" };
    const rows = this.executions.filter(execution => execution.tool_id === id && (query.is_error == null || (execution.is_error ?? false) === query.is_error) && (query.agent_id == null || execution.agent_id === query.agent_id) && (query.branch_id == null || execution.branch_id === query.branch_id) && (query.start_time == null || execution.timestamp >= query.start_time) && (query.end_time == null || execution.timestamp <= query.end_time)).sort((a, b) => b.timestamp - a.timestamp || a.id.localeCompare(b.id));
    const result = page(rows, paging);
    return { value: { executions: result.rows, next_cursor: result.next_cursor, has_more: result.has_more } };
  }
}

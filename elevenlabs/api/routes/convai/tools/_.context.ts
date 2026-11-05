import type { ToolResponseModel as Tool } from "../../../types/v1/components/schemas/ToolResponseModel.js";
import type { ToolExecutionResponseModel as Execution } from "../../../types/v1/components/schemas/ToolExecutionResponseModel.js";
import type { ToolsResponseModel } from "../../../types/v1/components/schemas/ToolsResponseModel.js";
import type { GetToolDependentAgentsResponseModel } from "../../../types/v1/components/schemas/GetToolDependentAgentsResponseModel.js";
import type { GetToolExecutionsPageResponseModel } from "../../../types/v1/components/schemas/GetToolExecutionsPageResponseModel.js";
import type { HTTP_GET_Query as ToolQuery } from "../../../types/v1/paths/convai/tools.types.js";
import type { HTTP_GET_Query as ExecutionQuery } from "../../../types/v1/paths/convai/tools/{tool_id}/executions.types.js";
import type { HTTP_GET_Query as DependentQuery } from "../../../types/v1/paths/convai/tools/{tool_id}/dependent-agents.types.js";
import type { ToolRequestModel } from "../../../types/v1/components/schemas/ToolRequestModel.js";
import type { StoredAgent } from "../agents/_.context.js";

type ErrorCode = "invalid_tool_query" | "tool_not_found" | "tool_in_use" | "unsupported_tool_force" | "invalid_tool_config" | "unsupported_tool_config";
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

const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
// Only bounded, literal parameter schemas are supported. No dynamic resolution,
// authentication, response mocks or external tool execution is simulated.
function literalSchema(v: unknown, depth = 0): boolean {
  if (!object(v) || depth > 4) return false;
  if (v.type === "object" || v.type === undefined) {
    if (!keys(v, ["type", "property_kind", "description", "properties", "required"]) || v.property_kind !== undefined && v.property_kind !== "object" || v.description !== undefined && typeof v.description !== "string") return false;
    const props = v.properties ?? {};
    return object(props) && Object.keys(props).length <= 50 && Object.values(props).every(p => literalSchema(p, depth + 1)) && (v.required === undefined || Array.isArray(v.required) && v.required.every(k => typeof k === "string" && Object.hasOwn(props, k)));
  }
  return keys(v, ["type", "description", "enum"]) && ["boolean", "string", "integer", "number"].includes(String(v.type)) && (v.description === undefined || typeof v.description === "string") && (v.enum == null || v.type === "string" && Array.isArray(v.enum) && v.enum.every(x => typeof x === "string"));
}
function normalizeTool(body: ToolRequestModel): Result<Tool["tool_config"]> {
  if (!object(body) || !object(body.tool_config)) return { error: "invalid_tool_config" };
  if (!keys(body, ["tool_config", "response_mocks"]) || body.response_mocks != null && (!Array.isArray(body.response_mocks) || body.response_mocks.length)) return { error: "unsupported_tool_config" };
  const c = body.tool_config;
  if (c.type !== "client" && c.type !== "webhook") return { error: "unsupported_tool_config" };
  if (typeof c.name !== "string" || !c.name.trim() || typeof c.description !== "string") return { error: "invalid_tool_config" };
  const common = ["type", "name", "description", "response_timeout_secs", "disable_interruptions", "interruption_mode", "force_pre_tool_speech", "pre_tool_speech", "assignments", "tool_call_sound", "tool_call_sound_behavior", "tool_error_handling_mode", "dynamic_variables", "execution_mode"];
  if (!keys(c, [...common, ...(c.type === "client" ? ["parameters", "expects_response"] : ["api_schema", "follow_redirects", "follow_redirects_allowed_domains"])]) || c.assignments !== undefined && (!Array.isArray(c.assignments) || c.assignments.length) || c.dynamic_variables !== undefined) return { error: "unsupported_tool_config" };
  for (const [key, values] of Object.entries({ interruption_mode: ["allow", "disable_during_tool", "disable_during_tool_and_turn"], pre_tool_speech: ["auto", "force", "off"], tool_call_sound: [null, "typing", "elevator1", "elevator2", "elevator3", "elevator4"], tool_call_sound_behavior: ["auto", "always"], tool_error_handling_mode: ["auto", "summarized", "passthrough", "hide"], execution_mode: ["immediate", "post_tool_speech", "async"] })) {
    if (Object.hasOwn(c, key) && !values.includes((c as Record<string, unknown>)[key] as never)) return { error: "invalid_tool_config" };
  }
  if ([c.disable_interruptions, c.force_pre_tool_speech, c.type === "client" ? c.expects_response : c.follow_redirects].some(v => v !== undefined && typeof v !== "boolean")) return { error: "invalid_tool_config" };
  const timeout = c.response_timeout_secs ?? 20;
  if (!Number.isFinite(timeout) || (c.type === "client" ? !(timeout >= 1 && timeout <= 120 || timeout === -1 && c.expects_response === true) : timeout < 5 || timeout > 300)) return { error: "invalid_tool_config" };
  if (c.type === "client" && c.parameters != null && !literalSchema(c.parameters)) return { error: "unsupported_tool_config" };
  if (c.type === "webhook") {
    const api = c.api_schema;
    if (!object(api) || typeof api.url !== "string") return { error: "invalid_tool_config" };
    try { if (!["https:", "http:"].includes(new URL(api.url).protocol)) return { error: "invalid_tool_config" }; } catch { return { error: "invalid_tool_config" }; }
    if (!keys(api, ["url", "method", "content_type", "request_headers", "path_params_schema", "query_params_schema", "request_body_schema", "response_body_schema"]) || c.follow_redirects || c.follow_redirects_allowed_domains?.length) return { error: "unsupported_tool_config" };
    if (api.method !== undefined && !["GET", "POST", "PUT", "PATCH", "DELETE"].includes(api.method) || api.content_type !== undefined && !["application/json", "application/x-www-form-urlencoded"].includes(api.content_type)) return { error: "invalid_tool_config" };
    if (api.request_headers !== undefined && (!object(api.request_headers) || Object.values(api.request_headers).some(v => typeof v !== "string")) || api.path_params_schema !== undefined && (!object(api.path_params_schema) || Object.values(api.path_params_schema).some(v => !literalSchema(v))) || [api.query_params_schema, api.request_body_schema, api.response_body_schema].some(v => v != null && !literalSchema(v))) return { error: "unsupported_tool_config" };
  }
  const config = structuredClone(c);
  const value = { ...config, response_timeout_secs: timeout, disable_interruptions: c.disable_interruptions ?? false, interruption_mode: c.interruption_mode ?? (c.disable_interruptions ? "disable_during_tool" : "allow"), force_pre_tool_speech: c.force_pre_tool_speech ?? false, pre_tool_speech: c.pre_tool_speech ?? (c.force_pre_tool_speech ? "force" : "auto"), assignments: c.assignments ?? [], tool_call_sound: c.tool_call_sound ?? null, tool_call_sound_behavior: c.tool_call_sound_behavior ?? "auto", tool_error_handling_mode: c.tool_error_handling_mode ?? "auto", execution_mode: c.execution_mode ?? "immediate" };
  if (value.type === "client") return { value: { ...value, expects_response: value.expects_response ?? false } as Tool["tool_config"] };
  return { value: { ...value, follow_redirects: false, api_schema: { ...value.api_schema, method: value.api_schema.method ?? "GET", content_type: value.api_schema.content_type ?? "application/json" } } as Tool["tool_config"] };
}

export class Context {
  tools = new Map<string, StoredTool>();
  executions: Execution[] = [];
  agentsMap: () => Map<string, StoredAgent> = () => new Map();
  currentUserId?: string;
  nextToolId = 0;
  mutationTime = 0;
  creatorAccess?: Tool["access_info"];

  createTool(body: ToolRequestModel): Result<Tool> {
    const normalized = normalizeTool(body);
    if (normalized.error) return normalized;
    if (!this.currentUserId || !this.creatorAccess) return { error: "invalid_tool_config" };
    let next = this.nextToolId;
    while (this.tools.has(`sim-tool-${next}`)) next++;
    const id = `sim-tool-${next}`;
    const configuration: Tool = { id, tool_config: normalized.value, access_info: structuredClone(this.creatorAccess), usage_stats: { total_calls: 0, avg_latency_secs: 0 } };
    this.tools.set(id, { configuration, creatorUserId: this.currentUserId, createdAt: this.mutationTime });
    this.nextToolId = next + 1;
    return { value: structuredClone(configuration) };
  }
  updateTool(id: string, body: ToolRequestModel): Result<Tool> {
    const record = this.tools.get(id);
    if (!record) return { error: "tool_not_found" };
    const normalized = normalizeTool(body);
    if (normalized.error) return normalized;
    record.configuration = { ...record.configuration, tool_config: normalized.value };
    delete record.configuration.response_mocks;
    return { value: structuredClone(record.configuration) };
  }

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

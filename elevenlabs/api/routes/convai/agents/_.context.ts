import type { GetAgentResponseModel as Agent } from "../../../types/v1/components/schemas/GetAgentResponseModel.js";
import type { AgentSummaryResponseModel as Summary } from "../../../types/v1/components/schemas/AgentSummaryResponseModel.js";
import type { GetAgentsPageResponseModel as Page } from "../../../types/v1/components/schemas/GetAgentsPageResponseModel.js";
import type { AgentSummaryBatchSuccessfulResponseModel as Success } from "../../../types/v1/components/schemas/AgentSummaryBatchSuccessfulResponseModel.js";
import type { BatchFailureResponseModel as Failure } from "../../../types/v1/components/schemas/BatchFailureResponseModel.js";
import type { ResourceAccessInfo } from "../../../types/v1/components/schemas/ResourceAccessInfo.js";
import type { HTTP_GET_Query as Query } from "../../../types/v1/paths/convai/agents.types.js";

type Result<T> = { value: T; error?: never } | { error: "invalid_agent" | "agent_not_found" | "invalid_agent_query"; value?: never };
export type StoredAgent = { configuration: Agent; creatorUserId: string };
type ObjectValue = Record<string, unknown>;
const object = (value: unknown): value is ObjectValue => typeof value === "object" && value !== null && !Array.isArray(value);
const keys = (value: ObjectValue, allowed: string[]) => Object.keys(value).every(key => allowed.includes(key));
const text = (value: unknown): value is string => typeof value === "string" && !!value.trim();
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every(text);
const optional = (value: ObjectValue, key: string, check: (v: unknown) => boolean) => value[key] === undefined || check(value[key]);
const models = ["gemini-3.5-flash", "gemini-2.5-flash", "gpt-4o", "gpt-4o-mini"];

// The configuration subset is deliberately explicit; other fields fail rather
// than being stored as if workflows, versioning or server-side tools ran.
function validConfig(value: unknown): boolean {
  if (!object(value) || !keys(value, ["agent", "tts"])) return false;
  if (value.tts !== undefined && (!object(value.tts) || !keys(value.tts, ["voice_id"]) || !optional(value.tts, "voice_id", text))) return false;
  if (value.agent === undefined) return true;
  const agent = value.agent;
  if (!object(agent) || !keys(agent, ["first_message", "language", "prompt"]) || !optional(agent, "first_message", v => typeof v === "string") || !optional(agent, "language", text)) return false;
  if (agent.prompt === undefined) return true;
  const prompt = agent.prompt;
  return object(prompt) && keys(prompt, ["prompt", "llm", "temperature", "max_tokens", "tool_ids", "tools"]) &&
    optional(prompt, "prompt", v => typeof v === "string") && optional(prompt, "llm", v => typeof v === "string" && models.includes(v)) &&
    optional(prompt, "temperature", v => v === null || typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 1) &&
    optional(prompt, "max_tokens", v => typeof v === "number" && Number.isInteger(v) && (v === -1 || v > 0)) &&
    optional(prompt, "tool_ids", strings) && optional(prompt, "tools", v => Array.isArray(v) && v.every(validTool));
}
function validTool(value: unknown): boolean {
  return object(value) && keys(value, ["type", "name", "description", "expects_response", "response_timeout_secs"]) && value.type === "client" && text(value.name) && typeof value.description === "string" &&
    optional(value, "expects_response", v => typeof v === "boolean") && optional(value, "response_timeout_secs", v => typeof v === "number" && Number.isFinite(v) && (v >= 1 && v <= 120 || v === -1 && value.expects_response === true));
}
const validPlatform = (value: unknown) => object(value) && keys(value, ["archived"]) && optional(value, "archived", v => typeof v === "boolean");
function validBody(value: unknown, patch: boolean): value is ObjectValue {
  return object(value) && keys(value, ["conversation_config", "platform_settings", "name", "tags"]) &&
    (patch ? value.conversation_config == null || validConfig(value.conversation_config) : validConfig(value.conversation_config)) &&
    (value.platform_settings == null || validPlatform(value.platform_settings)) && (value.name == null || text(value.name)) && (value.tags == null || strings(value.tags));
}
// Merge only validated fixed configuration objects. Arrays replace atomically;
// the sole nested nullable value, temperature, is preserved as an explicit null.
function merge(base: ObjectValue, patch: ObjectValue): ObjectValue {
  const result = structuredClone(base);
  for (const [key, value] of Object.entries(patch)) {
    result[key] = object(value) ? merge(object(result[key]) ? result[key] : {}, value) : structuredClone(value);
  }
  return result;
}
export class Context {
  agents = new Map<string, StoredAgent>();
  nextAgentNumber = 0;
  nextMutationNumber = 0;
  defaults?: { name: string; voiceId: string; userId: string; timeUnix: number; accessInfo: ResourceAccessInfo };

  private settings() {
    if (!this.defaults) throw new Error("Agent defaults are not initialized; run startup or reset");
    return this.defaults;
  }
  private summary(record: StoredAgent): Summary {
    const agent = record.configuration;
    return structuredClone({ agent_id: agent.agent_id, name: agent.name, voice_id: agent.conversation_config.tts!.voice_id!, tags: agent.tags ?? [], ...agent.metadata, access_info: agent.access_info!, last_call_time_unix_secs: null, archived: agent.platform_settings?.archived ?? false });
  }
  getAgent(id: string): Agent | undefined {
    const record = this.agents.get(id);
    return record ? structuredClone(record.configuration) : undefined;
  }
  createAgent(input: unknown): Result<{ agent_id: string }> {
    if (!validBody(input, false)) return { error: "invalid_agent" };
    const defaults = this.settings();
    let agent_id: string;
    do { agent_id = `sim-agent-created-${++this.nextAgentNumber}`; } while (this.agents.has(agent_id));
    const time = defaults.timeUnix + ++this.nextMutationNumber;
    const configuration = {
      agent_id, name: input.name ?? defaults.name,
      conversation_config: merge({ tts: { voice_id: defaults.voiceId } }, input.conversation_config as ObjectValue),
      platform_settings: input.platform_settings ?? {}, tags: input.tags ?? [],
      metadata: { created_at_unix_secs: time, updated_at_unix_secs: time }, access_info: defaults.accessInfo,
    } as Agent;
    this.agents.set(agent_id, { configuration: structuredClone(configuration), creatorUserId: defaults.userId });
    return { value: { agent_id } };
  }
  updateAgent(id: string, input: unknown): Result<Agent> {
    const record = this.agents.get(id);
    if (!record) return { error: "agent_not_found" };
    if (!validBody(input, true)) return { error: "invalid_agent" };
    const candidate = structuredClone(record.configuration);
    if (input.name != null) candidate.name = input.name as string;
    if (input.tags != null) candidate.tags = structuredClone(input.tags as string[]);
    if (input.conversation_config != null) candidate.conversation_config = merge(candidate.conversation_config as ObjectValue, input.conversation_config as ObjectValue);
    if (input.platform_settings != null) candidate.platform_settings = merge(candidate.platform_settings as ObjectValue ?? {}, input.platform_settings as ObjectValue);
    if (JSON.stringify(candidate) !== JSON.stringify(record.configuration)) candidate.metadata.updated_at_unix_secs = this.settings().timeUnix + ++this.nextMutationNumber;
    this.agents.set(id, { ...record, configuration: candidate });
    return { value: structuredClone(candidate) };
  }
  duplicateAgent(id: string, input: unknown): Result<{ agent_id: string }> {
    const original = this.getAgent(id);
    if (!original) return { error: "agent_not_found" };
    if (!object(input) || !keys(input, ["name"]) || input.name != null && !text(input.name)) return { error: "invalid_agent" };
    return this.createAgent({ name: input.name ?? `${original.name} (copy)`, conversation_config: original.conversation_config, platform_settings: original.platform_settings, tags: original.tags });
  }
  deleteAgent(id: string) { return this.agents.delete(id); }
  listAgents(query: Query = {}): Result<Page> {
    const size = query.page_size ?? 30;
    const cursor = query.cursor ?? "0";
    if (!keys(query, ["page_size", "search", "archived", "show_only_owned_agents", "created_by_user_id", "tags", "sort_direction", "sort_by", "cursor"]) || !Number.isInteger(size) || size < 1 || size > 100 || typeof cursor !== "string" || !/^(0|[1-9][0-9]*)$/.test(cursor) || !Number.isSafeInteger(Number(cursor)) || query.sort_by != null && !["name", "created_at", "updated_at"].includes(query.sort_by) || query.sort_direction !== undefined && !["asc", "desc"].includes(query.sort_direction) || query.search != null && typeof query.search !== "string" || query.archived != null && typeof query.archived !== "boolean" || query.tags != null && !strings(query.tags) || query.created_by_user_id != null && !text(query.created_by_user_id) || query.show_only_owned_agents !== undefined && typeof query.show_only_owned_agents !== "boolean") return { error: "invalid_agent_query" };
    const user = query.created_by_user_id === "@me" || query.created_by_user_id == null && query.show_only_owned_agents ? this.settings().userId : query.created_by_user_id;
    const rows = [...this.agents.values()].filter(record => {
      const a = record.configuration;
      return (query.search == null || a.name.toLowerCase().includes(query.search.toLowerCase())) && (query.archived == null || (a.platform_settings?.archived ?? false) === query.archived) && (user == null || user === record.creatorUserId) && (query.tags == null || query.tags.length === 0 || query.tags.some(tag => a.tags?.includes(tag)));
    }).map(record => this.summary(record));
    const direction = query.sort_direction === "asc" ? 1 : -1;
    rows.sort((a, b) => {
      const key = query.sort_by === "name" ? "name" : query.sort_by === "updated_at" ? "updated_at_unix_secs" : "created_at_unix_secs";
      const order = key === "name" ? a.name.localeCompare(b.name) : a[key] - b[key];
      return direction * order || a.agent_id.localeCompare(b.agent_id);
    });
    const offset = Number(cursor);
    const has_more = offset + size < rows.length;
    return { value: { agents: rows.slice(offset, offset + size), next_cursor: has_more ? String(offset + size) : null, has_more } };
  }
  getSummaries(ids: unknown): Result<Record<string, Success | Failure>> {
    if (!strings(ids) || ids.length === 0 || ids.length > 100) return { error: "invalid_agent_query" };
    return { value: Object.fromEntries(ids.map(id => {
      const record = this.agents.get(id);
      return [id, record ? { status: "success", data: this.summary(record) } : { status: "failure", error_code: 404, error_status: "agent_not_found", error_message: "Agent not found" }];
    })) };
  }
}

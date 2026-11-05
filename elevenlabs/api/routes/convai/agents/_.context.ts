import type { MultipartFile } from "../../../counterfact-types/index.js";
import {copyUpload} from "../../assets/_.context.js";
import type { Body_Simulates_a_conversation_v1_convai_agents__agent_id__simulate_conversation_post as SimulationRequest } from "../../../types/v1/components/schemas/Body_Simulates_a_conversation_v1_convai_agents__agent_id__simulate_conversation_post.js";
import type { AgentSimulatedChatTestResponseModel as SimulationResponse } from "../../../types/v1/components/schemas/AgentSimulatedChatTestResponseModel.js";
import type { GetAgentEmbedResponseModel as Embed } from "../../../types/v1/components/schemas/GetAgentEmbedResponseModel.js";
import type { GetAgentLinkResponseModel as Link } from "../../../types/v1/components/schemas/GetAgentLinkResponseModel.js";
import type { WidgetLanguagePresetResponse } from "../../../types/v1/components/schemas/WidgetLanguagePresetResponse.js";
import type { GetAgentResponseModel as Agent } from "../../../types/v1/components/schemas/GetAgentResponseModel.js";
import type { AgentSummaryResponseModel as Summary } from "../../../types/v1/components/schemas/AgentSummaryResponseModel.js";
import type { GetAgentsPageResponseModel as Page } from "../../../types/v1/components/schemas/GetAgentsPageResponseModel.js";
import type { AgentSummaryBatchSuccessfulResponseModel as Success } from "../../../types/v1/components/schemas/AgentSummaryBatchSuccessfulResponseModel.js";
import type { BatchFailureResponseModel as Failure } from "../../../types/v1/components/schemas/BatchFailureResponseModel.js";
import type { ResourceAccessInfo } from "../../../types/v1/components/schemas/ResourceAccessInfo.js";
import type { HTTP_GET_Query as Query } from "../../../types/v1/paths/convai/agents.types.js";

type Result<T> = { value: T; error?: never } | { error: "invalid_agent" | "agent_not_found" | "invalid_agent_query"; value?: never };
export type MainBranch = { id: string; name: string };
export type StoredAgent = {
  configuration: Agent;
  creatorUserId: string;
  mainBranch?: MainBranch;
  media?: Map<string, MultipartFile>;
};
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
  nextMedia = 0;
  mediaDefaults?: { maxBytes: number; maxName: number; maxDuration: number };
  getMedia(id: string, path: string) {
    const record = this.agents.get(id);
    if (!record) throw new MediaError(404, "agent_not_found");
    const upload = record.media?.get(path);
    return upload ? structuredClone(upload) : undefined;
  }
  private mediaUpload(id: string, input: unknown, audio: boolean) {
    const record = this.agents.get(id);
    if (!record) throw new MediaError(404, "agent_not_found");
    if (!this.mediaDefaults) throw new Error("Run startup or reset");
    const file = convaiUpload(
      input,
      this.mediaDefaults,
      audio ? ["audio/mpeg", "audio/wav", "audio/x-wav"] : imageTypes,
    );
    const duration = audio ? audioDuration(file) : undefined;
    if (
      duration !== undefined &&
      (duration <= 0 || duration > this.mediaDefaults.maxDuration)
    )
      throw new MediaError(400, "invalid_hold_audio");
    const path = `https://simulator.invalid/convai/media/${id}/${this.nextMedia}`;
    record.media ??= new Map();
    record.media.set(path, file);
    this.nextMedia++;
    return { record, file, path, duration };
  }
  uploadAvatar(id: string, input: unknown) {
    const { record, path } = this.mediaUpload(id, input, false);
    record.configuration.platform_settings ??= {};
    record.configuration.platform_settings.widget ??= {};
    record.configuration.platform_settings.widget.custom_avatar_path = path;
    record.configuration.platform_settings.widget.avatar = {
      type: "image",
      url: path,
    };
    return { agent_id: id, avatar_url: path };
  }
  uploadHoldAudio(id: string, input: unknown) {
    const { record, file, path, duration } = this.mediaUpload(id, input, true);
    const hold_audio = {
      audio_path: path,
      audio_url: path,
      original_filename: file.filename,
      duration_secs: duration!,
      size_bytes: file.size,
    };
    record.configuration.platform_settings ??= {};
    record.configuration.platform_settings.queueing_config ??= {};
    record.configuration.platform_settings.queueing_config.hold_audio =
      hold_audio;
    return structuredClone({ agent_id: id, hold_audio });
  }
  topicRuns = new Map<
    string,
    {
      agentId: string;
      result: import("../../../types/v1/components/schemas/GetAgentTopicsResponseModel.js").GetAgentTopicsResponseModel;
    }
  >();

  getTopics(
    id: string,
    query: Record<string, unknown> = {},
  ):
    | {
        value: import("../../../types/v1/components/schemas/GetAgentTopicsResponseModel.js").GetAgentTopicsResponseModel;
        error?: never;
      }
    | {
        error:
          | "agent_not_found"
          | "invalid_topic_query"
          | "unsupported_topic_aggregation";
        value?: never;
      } {
    if (!this.agents.has(id)) return { error: "agent_not_found" };
    const integer = (v: unknown): number | undefined => {
      return typeof v === "number" && Number.isSafeInteger(v) ? v : undefined;
    };
    const size = query.page_size == null ? 30 : integer(query.page_size);
    const from =
      query.from_unix_secs == null ? undefined : integer(query.from_unix_secs);
    const to =
      query.to_unix_secs == null ? undefined : integer(query.to_unix_secs);
    const cursor = query.cursor ?? "0";
    const sort = query.sort_by ?? "conversations";
    const direction = query.sort_direction ?? "desc";
    if (
      !keys(query, [
        "page_size",
        "from_unix_secs",
        "to_unix_secs",
        "cursor",
        "sort_by",
        "sort_direction",
        "include_evaluation_criteria",
      ]) ||
      size === undefined ||
      size < 1 ||
      size > 100 ||
      (query.from_unix_secs != null && from === undefined) ||
      (query.to_unix_secs != null && to === undefined) ||
      (from === undefined) !== (to === undefined) ||
      (from !== undefined && (from < 0 || to! <= from)) ||
      typeof cursor !== "string" ||
      !/^(0|[1-9][0-9]*)$/.test(cursor) ||
      !Number.isSafeInteger(Number(cursor)) ||
      !["conversations", "sentiment", "frustration", "success_rate"].includes(
        sort as string,
      ) ||
      !["asc", "desc"].includes(direction as string) ||
      (query.include_evaluation_criteria !== undefined &&
        typeof query.include_evaluation_criteria !== "boolean")
    )
      return { error: "invalid_topic_query" };
    const start =
      from === undefined ? undefined : Math.floor(from / 86400) * 86400;
    let runs = [...this.topicRuns.values()].filter((run) => run.agentId === id);
    if (start !== undefined)
      runs = runs.filter(
        (run) =>
          run.result.window_start_unix_secs >= start &&
          run.result.window_end_unix_secs <= to!,
      );
    runs.sort(
      (a, b) =>
        b.result.window_end_unix_secs - a.result.window_end_unix_secs ||
        b.result.window_start_unix_secs - a.result.window_start_unix_secs,
    );
    if (start !== undefined && runs.length > 1)
      return { error: "unsupported_topic_aggregation" };
    const result = structuredClone(
      runs[0]?.result ?? {
        topics: [],
        window_start_unix_secs: start ?? 0,
        window_end_unix_secs: to ?? 0,
      },
    );
    result.aggregated_run_count = runs.length ? 1 : 0;
    const score = (
      topic: (typeof result.topics)[number],
    ): number | null | undefined => {
      if (sort === "conversations") return topic.conversation_count;
      if (sort === "success_rate") return topic.success_rate;
      const distribution =
        topic.metrics?.sentiment?.[sort as "sentiment" | "frustration"];
      return distribution?.count && distribution.sum != null
        ? distribution.sum / distribution.count
        : null;
    };
    // Fixture topics are independent top-level groups; hierarchy discovery and
    // aggregation are deliberately not inferred from labels or conversations.
    result.topics.sort((a, b) => {
      const x = score(a),
        y = score(b);
      return x == null
        ? y == null
          ? a.topic_id.localeCompare(b.topic_id)
          : 1
        : y == null
          ? -1
          : (direction === "asc" ? 1 : -1) * (x - y) ||
            a.topic_id.localeCompare(b.topic_id);
    });
    const offset = Number(cursor);
    result.has_more = offset + size < result.topics.length;
    result.next_cursor = result.has_more ? String(offset + size) : null;
    result.topics = result.topics.slice(offset, offset + size);
    if (query.include_evaluation_criteria === false)
      for (const topic of result.topics)
        if (topic.metrics) delete topic.metrics.evaluation_criteria;
    return { value: result };
  }
  simulationDefaults?: {
    maxNewTurns: number;
    maxHistoryTurns: number;
    userMessage: string;
    agentReply: string;
    analysis: SimulationResponse["analysis"];
    rationale: string;
  };
  simulateConversation(
    id: string,
    request: SimulationRequest,
  ):
    | { value: SimulationResponse; error?: never }
    | { error: "agent_not_found" | "invalid_simulation"; value?: never } {
    const agent = this.getAgent(id);
    if (!agent) return { error: "agent_not_found" };
    const defaults = this.simulationDefaults;
    if (!defaults) throw new Error("Run simulation startup or reset first");
    const invalid = { error: "invalid_simulation" } as const;
    if (
      !object(request) ||
      !keys(request, [
        "simulation_specification",
        "extra_evaluation_criteria",
        "new_turns_limit",
      ])
    )
      return invalid;
    const spec = request.simulation_specification;
    if (
      !object(spec) ||
      !keys(spec, [
        "simulated_user_config",
        "tool_mock_config",
        "partial_conversation_history",
        "dynamic_variables",
      ]) ||
      !object(spec.simulated_user_config)
    )
      return invalid;
    if (
      spec.simulated_user_config.first_message !== undefined &&
      typeof spec.simulated_user_config.first_message !== "string"
    )
      return invalid;
    const limit = request.new_turns_limit ?? 100;
    if (!Number.isSafeInteger(limit) || limit < 0) return invalid;
    if (
      spec.tool_mock_config !== undefined &&
      (!object(spec.tool_mock_config) ||
        Object.keys(spec.tool_mock_config).length)
    )
      return invalid;
    if (spec.dynamic_variables !== undefined && !object(spec.dynamic_variables))
      return invalid;
    const history = spec.partial_conversation_history ?? [];
    if (
      !Array.isArray(history) ||
      history.length > defaults.maxHistoryTurns ||
      history.some(
        (turn) =>
          !object(turn) ||
          !keys(turn, [
            "role",
            "message",
            "time_in_call_secs",
            "tool_calls",
            "tool_results",
          ]) ||
          !["agent", "user"].includes(turn.role) ||
          (turn.message != null && typeof turn.message !== "string") ||
          !Number.isFinite(turn.time_in_call_secs) ||
          turn.time_in_call_secs < 0 ||
          (turn.tool_calls !== undefined &&
            (!Array.isArray(turn.tool_calls) || turn.tool_calls.length > 0)) ||
          (turn.tool_results !== undefined &&
            (!Array.isArray(turn.tool_results) ||
              turn.tool_results.length > 0)),
      )
    )
      return invalid;
    if (
      history.some(
        (turn, index) =>
          index > 0 &&
          turn.time_in_call_secs < history[index - 1].time_in_call_secs,
      )
    )
      return invalid;
    const criteria = request.extra_evaluation_criteria ?? [];
    if (
      !Array.isArray(criteria) ||
      criteria.some(
        (item) =>
          !object(item) ||
          !text(item.id) ||
          !text(item.name) ||
          !text(item.conversation_goal_prompt),
      ) ||
      new Set(criteria.map((item) => item.id)).size !== criteria.length
    )
      return invalid;
    const interpolate = (message: string) =>
      message.replace(/\{\{\s*([^{}]+?)\s*\}\}/g, (token, name: string) => {
        const value = Object.hasOwn(spec.dynamic_variables ?? {}, name)
          ? spec.dynamic_variables![name]
          : undefined;
        return ["string", "number", "boolean"].includes(typeof value)
          ? String(value)
          : token;
      });
    const turns: SimulationResponse["simulated_conversation"] = history.map(
      (turn) => ({
        role: turn.role,
        message: turn.message,
        time_in_call_secs: turn.time_in_call_secs,
      }),
    );
    for (
      let index = 0;
      index < Math.min(limit, defaults.maxNewTurns);
      index++
    ) {
      const previous = turns.at(-1);
      const firstMessage = agent.conversation_config.agent?.first_message ?? "";
      const role = previous
        ? previous.role === "agent"
          ? "user"
          : "agent"
        : firstMessage
          ? "agent"
          : "user";
      const message =
        role === "agent"
          ? !previous
            ? (agent.conversation_config.agent?.first_message ??
              defaults.agentReply)
            : defaults.agentReply
          : spec.simulated_user_config.first_message || defaults.userMessage;
      turns.push({
        role,
        message: interpolate(message),
        time_in_call_secs: previous ? previous.time_in_call_secs + 1 : 0,
      });
    }
    const analysis = structuredClone(defaults.analysis);
    const results = criteria.map((item) => ({
      criteria_id: item.id,
      result: "unknown" as const,
      rationale: defaults.rationale,
      scoring_mode: item.scoring_mode ?? "binary",
      score: null,
      max_score:
        item.scoring_mode === "numeric_uniform"
          ? (item.max_score ?? 100)
          : null,
    }));
    analysis.evaluation_criteria_results = Object.fromEntries(
      results.map((result) => [result.criteria_id, result]),
    );
    analysis.evaluation_criteria_results_list = results;
    return { value: { simulated_conversation: turns, analysis } };
  }
  simulationEvents(result: SimulationResponse): string {
    // Buffered local SSE convention: message lists concatenate, final data carries analysis.
    return [
      ...result.simulated_conversation.map((turn) => ({
        simulated_conversation: [turn],
      })),
      { analysis: result.analysis },
    ]
      .map((data) => `data: ${JSON.stringify(data)}\n\n`)
      .join("");
  }
  knowledgeBase?:()=>import("../knowledge-base/_.context.js").Context;
  queryKnowledgeBase(id:string,input:unknown,branchId?:string|null){if(!this.knowledgeBase)throw new Error("Run startup or reset");return this.knowledgeBase().queryAgent(id,input,branchId);}
  lifecycle?: import("./{agent_id}/branches/_.context.js").Context;
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
  deleteHoldAudio(id: string): Result<{ agent_id: string }> {
    const agent = this.agents.get(id)?.configuration;
    if (!agent) return { error: "agent_not_found" };
    // This is live configuration metadata; immutable versions remain untouched.
    if (agent.platform_settings?.queueing_config)
      delete agent.platform_settings.queueing_config.hold_audio;
    return { value: { agent_id: id } };
  }
  getWidget(
    id: string,
    signature?: string | null,
  ):
    | { value: Embed; error?: never }
    | {
        error: "agent_not_found" | "unsupported_agent_signature";
        value?: never;
      } {
    const agent = this.agents.get(id)?.configuration;
    if (!agent) return { error: "agent_not_found" };
    if (signature != null) return { error: "unsupported_agent_signature" };
    const {
      language_presets: widgetPresets,
      custom_avatar_path: _,
      language_selector: __,
      ...widget
    } = agent.platform_settings?.widget ?? {};
    const conversation = agent.conversation_config;
    const presets: Record<string, WidgetLanguagePresetResponse> = Object.create(null);
    for (const language of [
      ...new Set([
        ...Object.keys(widgetPresets ?? {}),
        ...Object.keys(conversation.language_presets ?? {}),
      ]),
    ].sort()) {
      const {
        text_contents_translation: _,
        terms_translation: __,
        ...preset
      } = widgetPresets?.[language] ?? {};
      const first =
        conversation.language_presets?.[language]?.overrides.agent
          ?.first_message;
      presets[language] = {
        ...preset,
        ...(first !== undefined ? { first_message: first } : {}),
      };
    }
    return {
      value: structuredClone({
        agent_id: id,
        widget_config: {
          ...widget,
          language: conversation.agent?.language ?? "en",
          first_message: conversation.agent?.first_message ?? "",
          text_only: conversation.conversation?.text_only ?? false,
          supports_text_only: widget.supports_text_only ?? true,
          supported_language_overrides: Object.keys(
            conversation.language_presets ?? {},
          ).sort(),
          language_presets: presets,
          ...(conversation.conversation?.file_input
            ? { file_input_config: conversation.conversation.file_input }
            : {}),
        },
      }),
    };
  }
  getLink(id: string): Result<Link> {
    return this.agents.has(id)
      ? { value: { agent_id: id, token: null } }
      : { error: "agent_not_found" };
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
    // Stored configuration has already been validated by its owning operation.
    // Copy it directly so references added by other domains are preserved.
    const defaults = this.settings();
    let agent_id: string;
    do { agent_id = `sim-agent-created-${++this.nextAgentNumber}`; } while (this.agents.has(agent_id));
    const time = defaults.timeUnix + ++this.nextMutationNumber;
    const {branch_id: _branch, version_id: _version, main_branch_id: _main, ...copied} = original;
    const configuration: Agent = { ...copied, agent_id, name: input.name as string ?? `${original.name} (copy)`,
      metadata: { created_at_unix_secs: time, updated_at_unix_secs: time }, access_info: structuredClone(defaults.accessInfo) };
    this.agents.set(agent_id, { configuration, creatorUserId: defaults.userId, media: structuredClone(this.agents.get(id)!.media) });
    return { value: { agent_id } };
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

export class MediaError extends Error {
  override name = "MediaError";
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}
const imageTypes = ["image/png", "image/jpeg", "image/gif", "image/webp"];
export function convaiUpload(
  input: unknown,
  defaults: { maxBytes: number; maxName: number },
  types: string[],
) {
  let file: MultipartFile;
  try {
    file = copyUpload(input, defaults.maxBytes, defaults.maxName);
  } catch {
    throw new MediaError(400, "invalid_convai_upload");
  }
  if (!types.includes(file.contentType.toLowerCase()))
    throw new MediaError(400, "unsupported_convai_media_type");
  file.contentType = file.contentType.toLowerCase();
  return file;
}
// Metadata parsing only: bounded PCM WAV or complete Layer III frame streams.
export function audioDuration(file: MultipartFile): number {
  const b = file.data;
  const bad = (): never => {
    throw new MediaError(400, "invalid_hold_audio");
  };
  if (file.contentType !== "audio/mpeg") {
    const v = new DataView(b.buffer, b.byteOffset, b.byteLength),
      tag = (n: number) => Buffer.from(b.subarray(n, n + 4)).toString("ascii");
    if (
      b.length < 44 ||
      tag(0) !== "RIFF" ||
      tag(8) !== "WAVE" ||
      v.getUint32(4, true) + 8 !== b.length
    )
      return bad();
    let rate = 0,
      align = 0,
      bytes = 0,
      fmt = false,
      seen = false;
    for (let at = 12; at < b.length;) {
      if (at + 8 > b.length) return bad();
      const size = v.getUint32(at + 4, true),
        end = at + 8 + size;
      if (end > b.length) return bad();
      if (tag(at) === "fmt ") {
        if (fmt || size < 16) return bad();
        fmt = true;
        const channels = v.getUint16(at + 10, true),
          sampleRate = v.getUint32(at + 12, true),
          bits = v.getUint16(at + 22, true);
        rate = v.getUint32(at + 16, true);
        align = v.getUint16(at + 20, true);
        if (
          v.getUint16(at + 8, true) !== 1 ||
          ![1, 2].includes(channels) ||
          ![8, 16, 24, 32].includes(bits) ||
          !sampleRate ||
          align !== (channels * bits) / 8 ||
          rate !== sampleRate * align
        )
          return bad();
      }
      if (tag(at) === "data") {
        if (seen) return bad();
        seen = true;
        bytes = size;
      }
      at = end + (size % 2);
      if (at > b.length) return bad();
    }
    if (!fmt || !seen || !bytes || bytes % align) return bad();
    return bytes / rate;
  }
  let at = 0,
    duration = 0,
    frames = 0;
  if (b.length >= 10 && Buffer.from(b.subarray(0, 3)).toString() === "ID3") {
    if (
      b[3] < 2 ||
      b[3] > 4 ||
      b[5] & 0x10 ||
      b.subarray(6, 10).some((x) => x & 128)
    )
      return bad();
    at = 10 + ((b[6] << 21) | (b[7] << 14) | (b[8] << 7) | b[9]);
  }
  while (at < b.length) {
    if (at + 4 > b.length) return bad();
    const a = b[at + 1],
      c = b[at + 2],
      version = (a >> 3) & 3,
      index = c >> 4,
      sample = (c >> 2) & 3;
    if (
      b[at] !== 255 ||
      (a & 224) !== 224 ||
      version === 1 ||
      ((a >> 1) & 3) !== 1 ||
      index === 0 ||
      index === 15 ||
      sample === 3
    )
      return bad();
    const hz =
        [44100, 48000, 32000][sample] /
        (version === 3 ? 1 : version === 2 ? 2 : 4),
      kbps = (
        version === 3
          ? [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320]
          : [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160]
      )[index];
    const length =
      Math.floor(((version === 3 ? 144 : 72) * kbps * 1000) / hz) +
      ((c >> 1) & 1);
    if (at + length > b.length) return bad();
    duration += (version === 3 ? 1152 : 576) / hz;
    at += length;
    frames++;
  }
  return frames ? duration : bad();
}

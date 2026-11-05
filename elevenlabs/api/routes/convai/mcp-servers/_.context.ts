import { createHash } from "node:crypto";
import type { MCPServerResponseModel as Server } from "../../../types/v1/components/schemas/MCPServerResponseModel.js";
import type { MCPToolConfigOverride_Output as Override } from "../../../types/v1/components/schemas/MCPToolConfigOverride-Output.js";
import type { ListMCPToolsResponseModel as ToolList } from "../../../types/v1/components/schemas/ListMCPToolsResponseModel.js";
import type { Tool } from "../../../types/v1/components/schemas/Tool.js";
import type { MCPApprovedToolDefinition as Definition } from "../../../types/v1/components/schemas/MCPApprovedToolDefinition.js";
import type { StoredAgent } from "../agents/_.context.js";
type Obj = Record<string, unknown>;
const object = (v: unknown): v is Obj =>
  !!v && typeof v === "object" && !Array.isArray(v);
const text = (v: unknown): v is string => typeof v === "string" && !!v.trim();
export class McpError extends Error {
  override name = "McpError";
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}
const fail = (
  status = 400,
  code = "invalid_mcp_request",
  message = "Invalid local MCP request",
): never => {
  throw new McpError(status, code, message);
};
const serverKeys = [
  "approval_policy",
  "force_pre_tool_speech",
  "pre_tool_speech",
  "disable_interruptions",
  "interruption_mode",
  "tool_call_sound",
  "tool_call_sound_behavior",
  "execution_mode",
  "response_timeout_secs",
  "request_headers",
  "request_meta",
  "disable_compression",
  "secret_token",
  "auth_connection",
];
const overrideKeys = [
  "force_pre_tool_speech",
  "pre_tool_speech",
  "disable_interruptions",
  "interruption_mode",
  "tool_call_sound",
  "tool_call_sound_behavior",
  "execution_mode",
  "response_timeout_secs",
  "assignments",
  "input_overrides",
  "response_mocks",
];
function input(v: unknown, allowed: string[]): Obj {
  if (!object(v) || Object.keys(v).some((k) => !allowed.includes(k)))
    return fail();
  return v;
}
function settings(v: Obj) {
  const enums: Record<string, string[]> = {
    approval_policy: [
      "auto_approve_all",
      "require_approval_all",
      "require_approval_per_tool",
    ],
    transport: ["SSE", "STREAMABLE_HTTP"],
    pre_tool_speech: ["auto", "force", "off"],
    interruption_mode: [
      "allow",
      "disable_during_tool",
      "disable_during_tool_and_turn",
    ],
    tool_call_sound: [
      "typing",
      "elevator1",
      "elevator2",
      "elevator3",
      "elevator4",
      "off",
    ],
    tool_call_sound_behavior: ["auto", "always"],
    execution_mode: ["immediate", "post_tool_speech", "async"],
  };
  for (const [key, allowed] of Object.entries(enums))
    if (v[key] != null && !allowed.includes(v[key] as string)) return fail();
  for (const key of [
    "force_pre_tool_speech",
    "disable_interruptions",
    "disable_compression",
  ])
    if (v[key] != null && typeof v[key] !== "boolean") return fail();
  if (
    v.response_timeout_secs != null &&
    (!Number.isInteger(v.response_timeout_secs) ||
      (v.response_timeout_secs as number) < 5 ||
      (v.response_timeout_secs as number) > 300)
  )
    return fail();
  for (const key of ["request_headers", "request_meta", "input_overrides"])
    if (v[key] != null && !object(v[key])) return fail();
  for (const key of ["assignments", "response_mocks"])
    if (
      v[key] != null &&
      (!Array.isArray(v[key]) || (v[key] as unknown[]).some((x) => !object(x)))
    )
      return fail();
}
// Sort nested object keys so equivalent JSON object ordering has the same local hash.
function canonical(v: unknown): string {
  return JSON.stringify(v, (_key, x: unknown) =>
    object(x)
      ? Object.fromEntries(
          Object.keys(x)
            .sort()
            .map((k) => [k, x[k]]),
        )
      : x,
  );
}
const hash = (d: Definition) =>
  createHash("sha256").update(canonical(d)).digest("hex");
export class Context {
  servers = new Map<string, Server>();
  discovered = new Map<string, Tool[]>();
  approved = new Map<string, Map<string, Definition>>();
  nextId = 1;
  defaults?: {
    time: number;
    owner: string;
    access: NonNullable<Server["access_info"]>;
  };
  agents: () => Map<string, StoredAgent> = () => new Map();
  private stored(id: string) {
    const s = this.servers.get(id);
    if (!s) return fail(404, "mcp_server_not_found", "MCP server not found");
    return s;
  }
  private environment(value = "production") {
    if (value !== "production")
      return fail(
        400,
        "unsupported_mcp_environment",
        "Only the local production tool catalog is supported",
      );
  }
  private tool(id: string, name: string) {
    this.stored(id);
    const t = this.discovered.get(id)?.find((t) => t.name === name);
    if (!t) return fail(404, "mcp_tool_not_found", "Local MCP tool not found");
    return t;
  }
  get(id: string): Server {
    const s = structuredClone(this.stored(id));
    s.dependent_agents = [...this.agents().values()]
      .filter(({ configuration: a }) => {
        const p = a.conversation_config.agent?.prompt;
        return (
          p?.mcp_server_ids?.includes(id) ||
          p?.native_mcp_server_ids?.includes(id)
        );
      })
      .map(({ configuration: a }) => ({
        id: a.agent_id,
        name: a.name,
        type: "available" as const,
        created_at_unix_secs: a.metadata.created_at_unix_secs,
        access_level: "admin" as const,
      }))
      .sort((a, b) => a.id.localeCompare(b.id));
    return s;
  }
  list() {
    return {
      mcp_servers: [...this.servers.keys()].sort().map((id) => this.get(id)),
    };
  }
  create(value: unknown) {
    const b = input(value, ["config"]),
      c = input(b.config, [
        ...serverKeys,
        "transport",
        "url",
        "name",
        "description",
        "tool_approval_hashes",
        "tool_config_overrides",
      ]);
    settings(c);
    if (
      !text(c.name) ||
      !(typeof c.url === "string"
        ? this.https(c.url)
        : object(c.url) &&
          Object.keys(c.url).length === 1 &&
          text(c.url.secret_id)) ||
      (c.description !== undefined && typeof c.description !== "string")
    )
      return fail();
    // Persist secret/auth references as configuration only; never resolve or call them.
    if (
      (c.tool_approval_hashes != null &&
        (!Array.isArray(c.tool_approval_hashes) ||
          c.tool_approval_hashes.length)) ||
      (c.tool_config_overrides != null &&
        (!Array.isArray(c.tool_config_overrides) ||
          c.tool_config_overrides.length))
    )
      return fail(
        400,
        "unsupported_initial_tool_configuration",
        "Create approvals and overrides after local tool discovery",
      );
    if (!this.defaults) throw new Error("Run MCP startup or reset first");
    let id: string;
    do {
      id = `sim-mcp-created-${this.nextId++}`;
    } while (this.servers.has(id));
    const config = {
      approval_policy: "require_approval_all",
      transport: "SSE",
      description: "",
      request_headers: {},
      request_meta: {},
      tool_approval_hashes: [],
      tool_config_overrides: [],
      ...structuredClone(c),
      name: c.name,
      url: structuredClone(c.url) as Server["config"]["url"],
    } as Server["config"];
    this.servers.set(id, {
      id,
      config,
      metadata: {
        created_at: this.defaults.time + this.nextId - 1,
        owner_user_id: this.defaults.owner,
      },
      access_info: structuredClone(this.defaults.access),
    });
    this.discovered.set(id, []);
    this.approved.set(id, new Map());
    return this.get(id);
  }
  private https(url: string) {
    try {
      const u = new URL(url);
      return (
        u.protocol === "https:" && !!u.hostname && !u.username && !u.password
      );
    } catch {
      return false;
    }
  }
  patch(id: string, value: unknown) {
    const s = this.stored(id),
      b = input(value, serverKeys);
    settings(b);
    const config = structuredClone(s.config) as unknown as Obj;
    for (const [key, v] of Object.entries(b))
      if (
        v != null ||
        ["secret_token", "auth_connection", "tool_call_sound"].includes(key)
      )
        config[key] = structuredClone(v);
    s.config = config as Server["config"];
    return this.get(id);
  }
  delete(id: string) {
    if (this.get(id).dependent_agents?.length)
      return fail(
        409,
        "mcp_server_in_use",
        "Remove agent references before deleting the MCP server",
      );
    this.servers.delete(id);
    this.discovered.delete(id);
    this.approved.delete(id);
    return {};
  }
  tools(
    id: string,
    environment?: string,
  ): ToolList & {
    tool_approval_statuses: NonNullable<ToolList["tool_approval_statuses"]>;
  } {
    const s = this.stored(id);
    this.environment(environment);
    const tools = structuredClone(this.discovered.get(id) ?? []);
    const statuses =
      s.config.approval_policy === "require_approval_per_tool"
        ? tools.map((t) => {
            const approval = s.config.tool_approval_hashes?.find(
                (a) => a.tool_name === t.name,
              ),
              snapshot = this.approved.get(id)?.get(t.name);
            const matches =
              approval?.tool_hash ===
              hash({
                description: t.description ?? "",
                input_schema: t.inputSchema,
              });
            return {
              tool_id: `mcp:${id}:${t.name}`,
              state: approval
                ? matches
                  ? ("up_to_date" as const)
                  : ("needs_review" as const)
                : ("not_approved" as const),
              approval_policy: approval?.approval_policy ?? null,
              approved_definition:
                approval && !matches && snapshot
                  ? structuredClone(snapshot)
                  : null,
            };
          })
        : [];
    return {
      success: true,
      tools,
      tool_approval_statuses: statuses,
      error_message: null,
    };
  }
  approve(id: string, value: unknown) {
    const s = this.stored(id),
      b = input(value, [
        "tool_name",
        "tool_description",
        "input_schema",
        "approval_policy",
      ]);
    if (
      !text(b.tool_name) ||
      typeof b.tool_description !== "string" ||
      (b.input_schema != null && !object(b.input_schema)) ||
      (b.approval_policy != null &&
        !["auto_approved", "requires_approval"].includes(
          b.approval_policy as string,
        ))
    )
      return fail();
    this.tool(id, b.tool_name);
    if (s.config.approval_policy !== "require_approval_per_tool")
      return fail(
        409,
        "mcp_approval_policy_conflict",
        "Enable per-tool approval before storing approvals",
      );
    const definition = {
      description: b.tool_description,
      input_schema: structuredClone(b.input_schema ?? {}),
    } as Definition;
    s.config.tool_approval_hashes = [
      ...(s.config.tool_approval_hashes ?? []).filter(
        (a) => a.tool_name !== b.tool_name,
      ),
      {
        tool_name: b.tool_name,
        tool_hash: hash(definition),
        approval_policy:
          (b.approval_policy as "auto_approved") ?? "requires_approval",
      },
    ];
    if (!this.approved.has(id)) this.approved.set(id, new Map());
    this.approved.get(id)!.set(b.tool_name, definition);
    return this.get(id);
  }
  removeApproval(id: string, name: string) {
    const s = this.stored(id);
    s.config.tool_approval_hashes = (
      s.config.tool_approval_hashes ?? []
    ).filter((a) => a.tool_name !== name);
    this.approved.get(id)?.delete(name);
    return this.get(id);
  }
  getOverride(id: string, name: string): Override {
    const o = this.stored(id).config.tool_config_overrides?.find(
      (o) => o.tool_name === name,
    );
    if (!o)
      return fail(
        404,
        "mcp_override_not_found",
        "Tool configuration override not found",
      );
    return structuredClone(o);
  }
  createOverride(id: string, value: unknown, environment?: string) {
    const s = this.stored(id),
      b = input(value, ["tool_name", ...overrideKeys]);
    settings(b);
    this.environment(environment);
    if (!text(b.tool_name)) return fail();
    this.tool(id, b.tool_name);
    if (
      s.config.tool_config_overrides?.some((o) => o.tool_name === b.tool_name)
    )
      return fail(
        409,
        "mcp_override_exists",
        "Tool configuration override already exists",
      );
    const o = structuredClone(b);
    if (o.assignments == null) o.assignments = [];
    s.config.tool_config_overrides = [
      ...(s.config.tool_config_overrides ?? []),
      o as Override,
    ];
    return this.get(id);
  }
  patchOverride(
    id: string,
    name: string,
    value: unknown,
    environment?: string,
  ) {
    const old = this.getOverride(id, name),
      b = input(value, overrideKeys);
    settings(b);
    this.environment(environment);
    const result = { ...old, ...structuredClone(b) };
    if (result.assignments == null) result.assignments = [];
    this.stored(id).config.tool_config_overrides = this.stored(
      id,
    ).config.tool_config_overrides!.map((o) =>
      o.tool_name === name ? (result as Override) : o,
    );
    return this.get(id);
  }
  removeOverride(id: string, name: string) {
    this.getOverride(id, name);
    const s = this.stored(id);
    s.config.tool_config_overrides = s.config.tool_config_overrides!.filter(
      (o) => o.tool_name !== name,
    );
    return this.get(id);
  }
}

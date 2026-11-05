import type { Scenario } from "../types/index.js";
export const emptyMcpServers: Scenario = ($) => {
  const c = $.loadContext("/convai/mcp-servers");
  c.servers = new Map();
  c.discovered = new Map();
  c.approved = new Map();
  c.nextId = 1;
  c.defaults = {
    time: 1735689600,
    owner: "sim-member-narrator",
    access: {
      is_creator: true,
      creator_name: "Narrator",
      creator_email: "narrator@example.invalid",
      role: "admin",
    },
  };
  c.agents = () => $.loadContext("/convai/agents").agents;
};
export const resetMcpServers: Scenario = ($) => {
  emptyMcpServers($);
  const c = $.loadContext("/convai/mcp-servers");
  c.servers = new Map([
    [
      "sim-mcp",
      {
        id: "sim-mcp",
        config: {
          name: "Local record tools",
          url: "https://example.invalid/mcp",
          approval_policy: "require_approval_all",
          transport: "SSE",
          request_headers: {},
          request_meta: {},
          tool_approval_hashes: [],
          tool_config_overrides: [],
        },
        metadata: {
          created_at: 1735689600,
          owner_user_id: "sim-member-narrator",
        },
        access_info: c.defaults!.access,
      },
    ],
  ]);
  c.discovered = new Map([
    [
      "sim-mcp",
      [
        {
          name: "lookup",
          description: "Look up a local record",
          inputSchema: { type: "object", properties: {} },
        },
      ],
    ],
  ]);
};
export const mcpDefinitionChanged: Scenario = ($) => {
  const c = $.loadContext("/convai/mcp-servers");
  if (c.discovered.has("sim-mcp"))
    c.discovered.set("sim-mcp", [
      {
        name: "lookup",
        description: "Look up a revised local record",
        inputSchema: { type: "object", properties: {} },
      },
    ]);
};
export const mcpAgentReference: Scenario = ($) => {
  const agent = $.loadContext("/convai/agents").agents.get("sim-agent");
  if (agent?.configuration.conversation_config.agent?.prompt)
    agent.configuration.conversation_config.agent.prompt.mcp_server_ids = [
      "sim-mcp",
    ];
};

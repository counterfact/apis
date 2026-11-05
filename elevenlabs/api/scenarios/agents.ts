import type { Scenario } from "../types/index.js";

export const emptyAgents: Scenario = ($) => {
  const context = $.loadContext("/convai/agents");
  context.agents = new Map();
  context.nextAgentNumber = 0;
  context.nextMutationNumber = 0;
  context.defaults = { name: "New agent", voiceId: "sim-narrator", userId: "sim-user", timeUnix: 1_735_689_600,
    accessInfo: { is_creator: true, creator_name: "Simulator", creator_email: "sim@example.invalid", role: "admin", access_source: "creator" } };
};

export const resetAgents: Scenario = ($) => {
  emptyAgents($);
  const context = $.loadContext("/convai/agents");
  context.agents.set("sim-agent", { creatorUserId: "sim-user", configuration: {
    agent_id: "sim-agent", name: "Simulator Support", tags: ["support"],
    conversation_config: { agent: { first_message: "Hello from the simulator.", language: "en", prompt: { prompt: "Help with synthetic examples.", llm: "gemini-3.5-flash", tool_ids: [] } }, tts: { voice_id: "sim-narrator" } },
    platform_settings: { archived: false },
    metadata: { created_at_unix_secs: 1_735_689_600, updated_at_unix_secs: 1_735_689_600 },
    access_info: structuredClone(context.defaults!.accessInfo),
  } });
};

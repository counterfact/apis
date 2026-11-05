import type { Scenario } from "../types/index.js";

export const emptyAgents: Scenario = ($) => {
  const context = $.loadContext("/convai/agents");
  context.agents = new Map();
  context.resources = () => ({
    voices: $.context.voices,
    models: $.context.models,
  });
  context.nextMedia = 0;
  context.mediaDefaults = {
    maxBytes: 1024 * 1024,
    maxName: 255,
    maxDuration: 180,
  };
  context.nextAgentNumber = 0;
  context.nextMutationNumber = 0;
  context.defaults = {
    name: "New agent",
    voiceId: "sim-narrator",
    userId: "sim-user",
    timeUnix: 1_735_689_600,
    conversationConfig: {
      agent: {
        first_message: "",
        language: "en",
        prompt: {
          prompt: "",
          llm: "gemini-3.5-flash",
          temperature: 0,
          max_tokens: -1,
          tool_ids: [],
          tools: [],
        },
      },
      tts: {
        voice_id: "sim-narrator",
        model_id: "eleven_v4_turbo",
        agent_output_audio_format: "pcm_16000",
        stability: 0.5,
        similarity_boost: 0.8,
        speed: 1,
      },
    },
    workflow: {
      nodes: {
        start: { type: "start", position: { x: 0, y: 0 }, edge_order: [] },
      },
      edges: {},
      prevent_subagent_loops: false,
    },
    accessInfo: {
      is_creator: true,
      creator_name: "Simulator",
      creator_email: "sim@example.invalid",
      role: "admin",
      access_source: "creator",
    },
  };
};

export const resetAgents: Scenario = ($) => {
  emptyAgents($);
  const context = $.loadContext("/convai/agents");
  context.agents.set("sim-agent", { creatorUserId: "sim-user", mainBranch: { id: "sim-main-branch", name: "main" }, configuration: {
    agent_id: "sim-agent", name: "Simulator Support", tags: ["support"],
    conversation_config: { agent: { first_message: "Hello from the simulator.", language: "en", prompt: { prompt: "Help with synthetic examples.", llm: "gemini-3.5-flash", tool_ids: [] } }, tts: { voice_id: "sim-narrator" } },
    platform_settings: { archived: false },
    metadata: { created_at_unix_secs: 1_735_689_600, updated_at_unix_secs: 1_735_689_600 },
    access_info: structuredClone(context.defaults!.accessInfo),
  } });
};

/** Replace canonical main-branch metadata for local dependency-picker flows. */
export const agentMainBranchPreview: Scenario = ($) => {
  const context = $.loadContext("/convai/agents");
  const agent = context.agents.get("sim-agent");
  if (!agent?.mainBranch) throw new Error("Run reset before agentMainBranchPreview");
  context.agents.set("sim-agent", {
    ...agent,
    mainBranch: { ...agent.mainBranch, name: "Preview main" },
  });
};

/** Seed a persisted analysis reference without running an evaluation. */
export const agentAnalysisReferences: Scenario = ($) => {
  const agent = $.loadContext("/convai/agents").agents.get("sim-agent");
  if (!agent) throw new Error("Run reset before agentAnalysisReferences");
  agent.configuration.platform_settings!.analysis_items = {
    evaluation_criteria: [{ source: "user", analysis_item_id: "sim-analysis-evaluation" }],
    data_collection: [],
  };
};

/** Configure local widget metadata without starting a conversation or translating text. */
export const agentWidgetConfiguration: Scenario = ($) => {
  const agent = $.loadContext("/convai/agents").agents.get("sim-agent");
  if (!agent) throw new Error("Run reset before agentWidgetConfiguration");
  agent.configuration.platform_settings!.widget = {
    bg_color: "#123456",
    markdown_link_allowed_hosts: [{ hostname: "simulator.invalid" }],
    language_presets: { es: { terms_text: "Local terms" } },
  };
  agent.configuration.conversation_config.language_presets = {
    es: { overrides: { agent: { first_message: "Hola" } } },
  };
  agent.configuration.conversation_config.conversation = {
    text_only: true,
    file_input: {
      enabled: false,
      max_files_per_conversation: 2,
      max_files_in_memory: 1,
    },
  };
};

/** Inert hold metadata; no upload or playback occurs. */
export const agentHoldAudioFixture: Scenario = ($) => {
  const live = $.loadContext("/convai/agents").agents.get("sim-agent")!.configuration;
  live.platform_settings!.queueing_config = {
    enabled: true, wait_timeout_seconds: 240,
    hold_audio: { audio_path: "synthetic/hold.mp3", audio_url: "https://simulator.invalid/hold.mp3",
      original_filename: "synthetic-hold.mp3", duration_secs: 1, size_bytes: 128 },
  };
  live.default_hold_audio_url = "https://simulator.invalid/default-tone.mp3";
  for (const version of $.loadContext("/convai/agents/{agent_id}/branches").versions.values()) {
    version.configuration.platform_settings!.queueing_config = structuredClone(live.platform_settings!.queueing_config);
    version.configuration.default_hold_audio_url = live.default_hold_audio_url;
  }
  // Live main configuration may diverge from its immutable stored tip.
  live.platform_settings!.queueing_config.wait_timeout_seconds = 300;
};

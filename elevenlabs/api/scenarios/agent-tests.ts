import type { Scenario } from "../types/index.js";
export const emptyAgentTests: Scenario = ($) => {
  const c = $.loadContext("/convai/agent-testing");
  c.tests = new Map();
  c.folders = new Map();
  c.nextId = 1;
  c.nextMutation = 0;
  c.defaults = {
    time: 1735689600,
    userId: "sim-member-narrator",
    access: {
      is_creator: true,
      creator_name: "Narrator",
      creator_email: "narrator@example.invalid",
      role: "admin",
    },
    definition: {
      common: { chat_history: [], dynamic_variables: {}, environment: "production", from_conversation_metadata: null, conversation_initiation_source: null },
      llm: { success_condition: "", success_examples: [], failure_examples: [] },
      tool: { tool_call_parameters: null, check_any_tool_matches: false },
      simulation: { simulation_scenario: "", simulation_max_turns: 5, simulation_environment: "production", tool_mock_config: { mocking_strategy: "none", fallback_strategy: "raise_error", mocked_tool_ids: [] }, tool_mock_overrides: {}, evaluation_model: "claude-sonnet-4-6", simulated_user_model: "claude-sonnet-4-6" },
      integration: { integration_id: "", credential_id: "", integration_connection_id: "" },
      integrationResult: { is_blocked: false, tool_latency_secs: 0, error_type: "", raw_error_message: "", dynamic_variable_updates: [] },
    },
  };
};
export const resetAgentTests: Scenario = ($) => {
  emptyAgentTests($);
  const c = $.loadContext("/convai/agent-testing"),
    meta = {
      parent: null,
      creator: "sim-member-narrator",
      created: 1735689600,
      updated: 1735689600,
      access: c.defaults!.access,
    };
  c.folders = new Map([
    [
      "sim-test-folder",
      { ...structuredClone(meta), id: "sim-test-folder", name: "Tool checks" },
    ],
  ]);
  c.tests = new Map([
    [
      "sim-test-llm",
      {
        ...structuredClone(meta),
        definition: {
          id: "sim-test-llm",
          name: "Greeting response",
          type: "llm",
          chat_history: [],
          success_condition: "Give a clear greeting",
          success_examples: [],
          failure_examples: [],
          dynamic_variables: {},
        },
      },
    ],
    [
      "sim-test-tool",
      {
        ...structuredClone(meta),
        parent: "sim-test-folder",
        definition: {
          id: "sim-test-tool",
          name: "Lookup tool selection",
          type: "tool",
          chat_history: [],
          tool_call_parameters: null,
          check_any_tool_matches: false,
        },
      },
    ],
    [
      "sim-test-simulation",
      {
        ...structuredClone(meta),
        creator: "sim-member-assistant",
        access: {
          is_creator: false,
          creator_name: "Assistant",
          creator_email: "assistant@example.invalid",
          role: "viewer",
        },
        definition: {
          id: "sim-test-simulation",
          name: "Shared support scenario",
          type: "simulation",
          chat_history: [],
          success_conditions: ["Provide a clear next step"],
          simulation_scenario: "Fictional customer support request",
          simulation_max_turns: 5,
        },
      },
    ],
  ]);
};

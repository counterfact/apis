import type { TestFromConversationMetadata_Output } from "./TestFromConversationMetadata-Output.js";
import type { ConversationHistoryTranscriptCommonModel_Output } from "./ConversationHistoryTranscriptCommonModel-Output.js";
import type { ConversationInitiationSource } from "./ConversationInitiationSource.js";
import type { SimulationToolMockBehaviorConfig } from "./SimulationToolMockBehaviorConfig.js";
import type { ToolResponseMockConfig_Output } from "./ToolResponseMockConfig-Output.js";
import type { LLM } from "./LLM.js";
export type SimulationTestModel = {
  /**
   * Metadata of a conversation this test was created from (if applicable).
   */
  from_conversation_metadata?: TestFromConversationMetadata_Output | null;
  /**
   * Dynamic variables to replace in the agent config during testing
   */
  dynamic_variables?: { [key: string]: unknown };
  chat_history?: Array<ConversationHistoryTranscriptCommonModel_Output>;
  /**
   * Simulate the test as if the conversation originated from this channel.
   */
  conversation_initiation_source?: ConversationInitiationSource | null;
  /**
   * The environment to resolve environment-specific variable values against when running this test (URL, headers, auth connections). If not provided, defaults to 'production'. For simulation tests, simulation_environment takes precedence when set.
   */
  environment?: string | null;
  /**
   * @default "simulation"
   */
  type?: "simulation";
  /**
   * Deprecated legacy single success criterion. Use success_conditions instead. At least one of success_condition or success_conditions is required.
   * @deprecated
   */
  success_condition?: string | null;
  /**
   * List of prompts that evaluate whether the simulation was successful. If provided, all criteria are evaluated and merged into a final result. Capped at the maximum number of evaluation criteria.
   */
  success_conditions?: Array<string>;
  /**
   * Description of the simulation scenario and user persona for simulation tests.
   * @default ""
   */
  simulation_scenario?: string;
  /**
   * Maximum number of conversation turns for simulation tests.
   * @default 5
   */
  simulation_max_turns?: number;
  /**
   * The environment to use when running this simulation test. If not provided, defaults to 'production'.
   */
  simulation_environment?: string | null;
  /**
   * Configuration for which tools to mock and fallback behavior.
   */
  tool_mock_config?: SimulationToolMockBehaviorConfig;
  /**
   * Test-specific response mocks, keyed by tool ID. Applied ahead of the tool's shared mocks and only within this test. Only take effect for tools that are mocked (see tool_mock_config).
   */
  tool_mock_overrides?: { [key: string]: Array<ToolResponseMockConfig_Output> };
  /**
   * LLM model to use for evaluating simulation results.
   * @default "claude-sonnet-4-6"
   */
  evaluation_model?: LLM | null;
  /**
   * LLM model for the simulated user.
   * @default "claude-sonnet-4-6"
   */
  simulated_user_model?: LLM | null;
};

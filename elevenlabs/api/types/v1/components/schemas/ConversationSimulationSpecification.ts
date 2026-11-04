import type { AgentConfigAPIModel_Input } from "./AgentConfigAPIModel-Input.js";
import type { ToolMockConfig } from "./ToolMockConfig.js";
import type { ConversationHistoryTranscriptCommonModel_Input } from "./ConversationHistoryTranscriptCommonModel-Input.js";
/**
 * A specification that will be used to simulate a conversation between an agent and an AI user.
 */
export type ConversationSimulationSpecification = {
  simulated_user_config: AgentConfigAPIModel_Input;
  tool_mock_config?: { [key: string]: ToolMockConfig };
  /**
   * A partial conversation history to start the simulation from. If empty, simulation starts fresh.
   */
  partial_conversation_history?: Array<ConversationHistoryTranscriptCommonModel_Input>;
  dynamic_variables?: { [key: string]: unknown };
};

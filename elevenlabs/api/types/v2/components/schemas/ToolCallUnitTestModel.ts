import type { TestFromConversationMetadata_Output } from "./TestFromConversationMetadata-Output.js";
import type { ConversationHistoryTranscriptCommonModel_Output } from "./ConversationHistoryTranscriptCommonModel-Output.js";
import type { ConversationInitiationSource } from "./ConversationInitiationSource.js";
import type { UnitTestToolCallEvaluationModel_Output } from "./UnitTestToolCallEvaluationModel-Output.js";
export type ToolCallUnitTestModel = {
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
   * @default "tool"
   */
  type?: "tool";
  /**
   * How to evaluate the agent's tool call (if any). If empty, the tool call is not evaluated.
   */
  tool_call_parameters?: UnitTestToolCallEvaluationModel_Output | null;
  /**
   * If set to True this test will pass if any tool call returned by the LLM matches the criteria. Otherwise it will fail if more than one tool is returned by the agent.
   */
  check_any_tool_matches?: boolean | null;
};

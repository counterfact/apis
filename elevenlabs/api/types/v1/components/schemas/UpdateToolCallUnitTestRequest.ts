import type { TestFromConversationMetadata_Input } from "./TestFromConversationMetadata-Input.js";
import type { ConversationHistoryTranscriptCommonModel_Input } from "./ConversationHistoryTranscriptCommonModel-Input.js";
import type { ConversationInitiationSource } from "./ConversationInitiationSource.js";
import type { UnitTestToolCallEvaluationModel_Input } from "./UnitTestToolCallEvaluationModel-Input.js";
export type UpdateToolCallUnitTestRequest = {
  /**
   * Metadata of a conversation this test was created from (if applicable).
   */
  from_conversation_metadata?: TestFromConversationMetadata_Input | null;
  /**
   * Dynamic variables to replace in the agent config during testing
   */
  dynamic_variables?: { [key: string]: unknown };
  chat_history?: Array<ConversationHistoryTranscriptCommonModel_Input>;
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
  tool_call_parameters?: UnitTestToolCallEvaluationModel_Input | null;
  /**
   * If set to True this test will pass if any tool call returned by the LLM matches the criteria. Otherwise it will fail if more than one tool is returned by the agent.
   */
  check_any_tool_matches?: boolean | null;
  name: string;
  /**
   * The ID of the parent folder. If not provided, the test will be moved to the root level.
   */
  parent_folder_id?: string | null;
};

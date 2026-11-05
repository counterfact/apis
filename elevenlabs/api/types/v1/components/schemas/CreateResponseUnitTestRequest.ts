import type { TestFromConversationMetadata_Input } from "./TestFromConversationMetadata-Input.js";
import type { ConversationHistoryTranscriptCommonModel_Input } from "./ConversationHistoryTranscriptCommonModel-Input.js";
import type { ConversationInitiationSource } from "./ConversationInitiationSource.js";
import type { AgentSuccessfulResponseExample } from "./AgentSuccessfulResponseExample.js";
import type { AgentFailureResponseExample } from "./AgentFailureResponseExample.js";
export type CreateResponseUnitTestRequest = {
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
   * @default "llm"
   */
  type?: "llm";
  /**
   * A prompt that evaluates whether the agent's response is successful. Should return True or False.
   * @default ""
   */
  success_condition?: string;
  /**
   * Non-empty list of example responses that should be considered successful
   */
  success_examples?: Array<AgentSuccessfulResponseExample>;
  /**
   * Non-empty list of example responses that should be considered failures
   */
  failure_examples?: Array<AgentFailureResponseExample>;
  name: string;
  /**
   * The ID of the parent folder. If not provided, the test will be created at the root level.
   */
  parent_folder_id?: string | null;
};

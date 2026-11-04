import type { ResourceAccessInfo } from "./ResourceAccessInfo.js";
import type { TestFromConversationMetadata_Output } from "./TestFromConversationMetadata-Output.js";
import type { ConversationHistoryTranscriptCommonModel_Output } from "./ConversationHistoryTranscriptCommonModel-Output.js";
import type { ConversationInitiationSource } from "./ConversationInitiationSource.js";
import type { AgentSuccessfulResponseExample } from "./AgentSuccessfulResponseExample.js";
import type { AgentFailureResponseExample } from "./AgentFailureResponseExample.js";
export type GetResponseUnitTestResponseModel = {
  /**
   * The access information for the requesting user on this test.
   */
  access_info?: ResourceAccessInfo | null;
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
  id: string;
  name: string;
};

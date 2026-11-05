import type { ConversationHistoryTranscriptToolCallWebhookDetails } from "./ConversationHistoryTranscriptToolCallWebhookDetails.js";
import type { ConversationHistoryTranscriptToolCallClientDetails } from "./ConversationHistoryTranscriptToolCallClientDetails.js";
import type { ConversationHistoryTranscriptToolCallMCPDetails } from "./ConversationHistoryTranscriptToolCallMCPDetails.js";
import type { ConversationHistoryTranscriptToolCallApiIntegrationWebhookDetails_Output } from "./ConversationHistoryTranscriptToolCallApiIntegrationWebhookDetails-Output.js";
export type ToolExecutionResponseModel = {
  /**
   * The ID of the tool that was executed
   */
  tool_id: string;
  /**
   * The request/call ID associated with this tool execution
   */
  tool_request_id: string;
  /**
   * The ID of the conversation where the tool was executed
   */
  conversation_id: string;
  /**
   * The ID of the agent that ran the tool
   */
  agent_id: string;
  /**
   * The branch ID if the agent has branches
   */
  branch_id?: string | null;
  /**
   * Unix timestamp when the tool was executed
   */
  timestamp: number;
  /**
   * How long the tool execution took
   */
  latency_secs: number;
  /**
   * Whether the tool execution failed
   * @default false
   */
  is_error?: boolean;
  /**
   * LLM-extracted parameters sent to the tool (JSON string)
   */
  request_payload?: string | null;
  /**
   * Response returned by the tool
   */
  response_payload?: string | null;
  /**
   * Error message if the tool execution failed
   */
  error_message?: string | null;
  /**
   * Error category (internal, customer_config, customer_auth, external_server, external_client, client_timeout, unknown)
   */
  error_type?: string | null;
  id: string;
  tool_call_details?:
    | (
        | (ConversationHistoryTranscriptToolCallWebhookDetails & {
            type: "webhook";
          })
        | (ConversationHistoryTranscriptToolCallClientDetails & {
            type: "client";
          })
        | (ConversationHistoryTranscriptToolCallMCPDetails & { type: "mcp" })
        | (ConversationHistoryTranscriptToolCallApiIntegrationWebhookDetails_Output & {
            type: "api_integration_webhook";
          })
      )
    | null;
};

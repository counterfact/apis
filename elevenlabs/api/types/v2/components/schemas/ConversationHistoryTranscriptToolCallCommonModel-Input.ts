import type { ToolType } from "./ToolType.js";
import type { ConversationHistoryTranscriptToolCallWebhookDetails } from "./ConversationHistoryTranscriptToolCallWebhookDetails.js";
import type { ConversationHistoryTranscriptToolCallClientDetails } from "./ConversationHistoryTranscriptToolCallClientDetails.js";
import type { ConversationHistoryTranscriptToolCallMCPDetails } from "./ConversationHistoryTranscriptToolCallMCPDetails.js";
import type { ConversationHistoryTranscriptToolCallApiIntegrationWebhookDetails_Input } from "./ConversationHistoryTranscriptToolCallApiIntegrationWebhookDetails-Input.js";
export type ConversationHistoryTranscriptToolCallCommonModel_Input = {
  type?: ToolType | null;
  request_id: string;
  tool_name: string;
  /**
   * ID of the called tool. Not set for tools without an ID, such as system tools.
   */
  tool_id?: string | null;
  params_as_json: string;
  tool_has_been_called: boolean;
  tool_details?:
    | (
        | (ConversationHistoryTranscriptToolCallWebhookDetails & {
            type: "webhook";
          })
        | (ConversationHistoryTranscriptToolCallClientDetails & {
            type: "client";
          })
        | (ConversationHistoryTranscriptToolCallMCPDetails & { type: "mcp" })
        | (ConversationHistoryTranscriptToolCallApiIntegrationWebhookDetails_Input & {
            type: "api_integration_webhook";
          })
      )
    | null;
};

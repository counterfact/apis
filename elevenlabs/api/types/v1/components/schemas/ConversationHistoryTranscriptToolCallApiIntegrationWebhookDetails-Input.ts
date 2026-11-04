import type { ConversationHistoryTranscriptToolCallWebhookDetails } from "./ConversationHistoryTranscriptToolCallWebhookDetails.js";
export type ConversationHistoryTranscriptToolCallApiIntegrationWebhookDetails_Input =
  {
    /**
     * @default "api_integration_webhook"
     */
    type?: "api_integration_webhook";
    /**
     * @default ""
     */
    integration_id?: string;
    /**
     * @default ""
     */
    credential_id?: string;
    /**
     * @default ""
     */
    integration_connection_id?: string;
    webhook_details: ConversationHistoryTranscriptToolCallWebhookDetails;
  };

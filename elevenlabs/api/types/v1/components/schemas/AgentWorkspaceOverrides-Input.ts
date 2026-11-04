import type { ConversationInitiationClientDataWebhook } from "./ConversationInitiationClientDataWebhook.js";
import type { ConvAIWebhooks } from "./ConvAIWebhooks.js";
export type AgentWorkspaceOverrides_Input = {
  /**
   * The webhook to send conversation initiation client data to
   */
  conversation_initiation_client_data_webhook?: ConversationInitiationClientDataWebhook | null;
  webhooks?: ConvAIWebhooks;
};

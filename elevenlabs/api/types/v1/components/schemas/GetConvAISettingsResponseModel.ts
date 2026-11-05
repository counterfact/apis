import type { ConversationInitiationClientDataWebhook } from "./ConversationInitiationClientDataWebhook.js";
import type { ConvAIWebhooks } from "./ConvAIWebhooks.js";
import type { LivekitStackType } from "./LivekitStackType.js";
export type GetConvAISettingsResponseModel = {
  conversation_initiation_client_data_webhook?: ConversationInitiationClientDataWebhook | null;
  webhooks?: ConvAIWebhooks;
  /**
   * Whether the workspace can use MCP servers
   * @default false
   */
  can_use_mcp_servers?: boolean;
  /**
   * @default 10
   */
  rag_retention_period_days?: number;
  /**
   * Days to retain conversation embeddings. None means use the system default (30 days).
   */
  conversation_embedding_retention_days?: number | null;
  /**
   * @default "standard"
   */
  default_livekit_stack?: LivekitStackType;
};

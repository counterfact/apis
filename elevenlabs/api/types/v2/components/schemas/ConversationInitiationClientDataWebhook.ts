import type { ConvAISecretLocator } from "./ConvAISecretLocator.js";
import type { ConvAIEnvVarLocator } from "./ConvAIEnvVarLocator.js";
/**
 * @example {"request_headers":{"Content-Type":"application/json"},"url":"https://example.com/webhook"}
 */
export type ConversationInitiationClientDataWebhook = {
  /**
   * The URL to send the webhook to
   */
  url: string;
  /**
   * The headers to send with the webhook request
   */
  request_headers: {
    [key: string]: string | ConvAISecretLocator | ConvAIEnvVarLocator;
  };
};

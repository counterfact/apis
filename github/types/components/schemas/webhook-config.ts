import type { webhook_config_url } from "./webhook-config-url.js";
import type { webhook_config_content_type } from "./webhook-config-content-type.js";
import type { webhook_config_secret } from "./webhook-config-secret.js";
import type { webhook_config_insecure_ssl } from "./webhook-config-insecure-ssl.js";

/**
 * Configuration object of the webhook
 */
export type webhook_config = {
  url?: webhook_config_url;
  content_type?: webhook_config_content_type;
  secret?: webhook_config_secret;
  insecure_ssl?: webhook_config_insecure_ssl;
};

/**
 * A custom webhook header value, encrypted at rest.
 */
export type AlertingWebhookSecretHeaderValue = {
  encrypted_value: string;
  nonce: string;
};

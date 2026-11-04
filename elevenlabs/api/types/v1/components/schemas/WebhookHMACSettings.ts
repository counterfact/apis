/**
 * Settings for creating an HMAC-authenticated webhook
 */
export type WebhookHMACSettings = {
  /**
   * The authentication type for this webhook
   */
  auth_type: "hmac";
  /**
   * The display name for this webhook
   */
  name: string;
  /**
   * The HTTPS callback URL that will be called when this webhook is triggered
   */
  webhook_url: string;
  /**
   * Optional custom request headers to include with each webhook delivery
   */
  request_headers?: { [key: string]: string } | null;
};

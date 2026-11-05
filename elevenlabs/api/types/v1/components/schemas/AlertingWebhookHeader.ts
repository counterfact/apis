export type AlertingWebhookHeader = {
  name: string;
  /**
   * @default false
   */
  is_secret?: boolean;
  /**
   * Header value. May be null only for a secret header on update.
   */
  value?: string | null;
};

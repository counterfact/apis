import type { Webhook } from "./Webhook.js";

export type Webhooks = {
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
  /**
   * An array of webhooks
   */
  items: Array<Webhook>;
};

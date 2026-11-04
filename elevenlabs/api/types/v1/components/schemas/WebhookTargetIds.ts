/**
 * Deliver the result to specific configured flows webhooks.
 */
export type WebhookTargetIds = {
  /**
   * Send the result to the listed flows webhooks.
   */
  type: "ids";
  /**
   * The IDs of the workspace flows webhooks to deliver the result to. Each must be one of the workspace's configured flows webhooks.
   */
  ids: Array<string>;
};

/**
 * Delivery made by a webhook, without request and response information.
 */
export type hook_delivery_item = {
  /**
   * Unique identifier of the webhook delivery.
   * @format int64
   * @example 42
   */
  id: number;
  /**
   * Unique identifier for the event (shared with all deliveries for all webhooks that subscribe to this event).
   * @example "58474f00-b361-11eb-836d-0e4f3503ccbe"
   */
  guid: string;
  /**
   * Time when the webhook delivery occurred.
   * @format date-time
   * @example "2021-05-12T20:33:44Z"
   */
  delivered_at: string;
  /**
   * Whether the webhook delivery is a redelivery.
   * @example false
   */
  redelivery: boolean;
  /**
   * Time spent delivering.
   * @example 0.03
   */
  duration: number;
  /**
   * Describes the response returned after attempting the delivery.
   * @example "failed to connect"
   */
  status: string;
  /**
   * Status code received when delivery was made.
   * @example 502
   */
  status_code: number;
  /**
   * The event that triggered the delivery.
   * @example "issues"
   */
  event: string;
  /**
   * The type of activity for the event that triggered the delivery.
   * @example "opened"
   */
  action: string;
  /**
   * The id of the GitHub App installation associated with this event.
   * @format int64
   * @example 123
   */
  installation_id: number;
  /**
   * The id of the repository associated with this event.
   * @format int64
   * @example 123
   */
  repository_id: number;
  /**
   * Time when the webhook delivery was throttled.
   * @format date-time
   * @example "2021-05-12T20:33:44Z"
   */
  throttled_at?: string;
};

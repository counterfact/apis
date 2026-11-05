import type { OrderId } from "./OrderId.js";
import type { OrderState } from "./OrderState.js";
/**
 * @example {"name":"Spanish Dubs","order_id":"prodorder_01jgatk6h0fwxrtbjade61yqhx","sandbox":false,"state":"submitted","submitted_at":"2025-03-15T10:30:00Z","total_amount_usd":11,"updated_at":"2025-03-15T10:30:00Z"}
 */
export type OrderSummary = {
  /**
   * The ID of the order.
   */
  order_id: OrderId;
  /**
   * The display name of the order.
   */
  name: string;
  /**
   * The current state of the order.
   */
  state: OrderState;
  /**
   * The total price for all items in USD. Excluded from response until quotes are available.
   */
  total_amount_usd?: number | null;
  /**
   * Whether this is a sandbox order that auto-progresses without producer intervention.
   * @default false
   */
  sandbox?: boolean;
  /**
   * The timestamp when the order was submitted, if applicable.
   */
  submitted_at?: string | null;
  /**
   * The timestamp when the order was last modified, if applicable.
   */
  updated_at?: string | null;
  /**
   * The reason the order was cancelled, if applicable.
   */
  cancel_reason?: string | null;
};

import type { OrderId } from "./OrderId.js";
import type { OrderState } from "./OrderState.js";
/**
 * @example {"order_id":"prodorder_01jgatk6h0fwxrtbjade61yqhx","state":"submitted","submitted_at":"2025-03-15T10:30:00Z"}
 */
export type SubmitOrderResponse = {
  /**
   * The ID of the submitted order.
   */
  order_id: OrderId;
  /**
   * The current state of the order after submission.
   */
  state: OrderState;
  /**
   * The timestamp when the order was submitted.
   * @format date-time
   */
  submitted_at: string;
};

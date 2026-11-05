import type { OrderId } from "./OrderId.js";
/**
 * @example {"order_id":"prodorder_01jgatk6h0fwxrtbjade61yqhx","sandbox":false}
 */
export type CreateOrderResponse = {
  /**
   * The ID of the newly created order.
   */
  order_id: OrderId;
  /**
   * Whether this is a sandbox order.
   * @default false
   */
  sandbox?: boolean;
};

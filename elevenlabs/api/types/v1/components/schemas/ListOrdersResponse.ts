import type { OrderSummary } from "./OrderSummary.js";
/**
 * @example {"orders":[{"name":"Spanish Dubs","order_id":"prodorder_01jgatk6h0fwxrtbjade61yqhx","state":"submitted","submitted_at":"2025-03-15T10:30:00Z","total_amount_usd":11,"updated_at":"2025-03-15T10:30:00Z"}]}
 */
export type ListOrdersResponse = {
  /**
   * The list of orders matching the query.
   */
  orders: Array<OrderSummary>;
};

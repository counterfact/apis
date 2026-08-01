import type { cancelOrder } from "../../../types/paths/orders/{public_id}/cancel.types.js";

// https://developer.ordergroove.com/reference/orders-cancel
// Cancelling an order is a PATCH operation; Ordergroove creates the next
// subscription order separately when the cancelled order is subscription-backed.
export const PATCH: cancelOrder = async ($) => {
  const order = $.context.cancelOrder($.path.public_id);
  return order
    ? $.response[200].json(order)
    : $.x.response[404].json({ error: "Order not found" });
};

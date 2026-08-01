import type { sendOrderNow } from "../../../types/paths/orders/{public_id}/send_now.types.js";

// https://developer.ordergroove.com/reference/orders-send-now
// The documented operation is PATCH and moves placement into a 24-hour window.
export const PATCH: sendOrderNow = async ($) => {
  const order = $.context.sendOrderNow($.path.public_id);
  return order
    ? $.response[200].json(order)
    : $.x.response[404].json({ error: "Order not found" });
};

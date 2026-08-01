import type { sendOrderNow } from "../../../types/paths/orders/{public_id}/send_now.types.js";

export const POST: sendOrderNow = async ($) => {
  const order = $.context.sendOrderNow($.path.public_id);
  return order
    ? $.response[200].json(order)
    : $.x.response[404].json({ error: "Order not found" });
};

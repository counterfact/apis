import type { sendOrderNow } from "../../../types/paths/orders/{public_id}/send_now.types.js";

export const POST: sendOrderNow = async ($) => {
  if (!$.context.isAuthorized($.auth.apiKey)) {
    return $.x.response[401].json({ error: "Unauthorized" });
  }

  const order = $.context.sendOrderNow($.path.public_id);
  return order
    ? $.response[200].json(order)
    : $.x.response[404].json({ error: "Order not found" });
};

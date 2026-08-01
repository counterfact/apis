import type { cancelOrder } from "../../../types/paths/orders/{public_id}/cancel.types.js";

export const POST: cancelOrder = async ($) => {
  if (!$.context.isAuthorized($.auth.apiKey)) {
    return $.x.response[401].json({ error: "Unauthorized" });
  }

  const order = $.context.cancelOrder($.path.public_id);
  return order
    ? $.response[200].json(order)
    : $.x.response[404].json({ error: "Order not found" });
};

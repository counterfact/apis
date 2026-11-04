import type { retrieveOrder } from "../../types/paths/orders/{public_id}.types.js";

export const GET: retrieveOrder = async ($) => {
  const order = $.context.getOrder($.path.public_id);
  return order
    ? $.response[200].json(order)
    : $.x.response[404].json({ error: "Order not found" });
};

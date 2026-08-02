import type { ordersRetrieve } from "../../types/paths/orders/{order_id}.types.js";

export const GET: ordersRetrieve = async ($) => {
  // Source: https://developer.ordergroove.com/reference/orders-retrieve
  const order = $.context.store.getOrder($.path.order_id);
  return order
    ? $.response[200].json(order)
    : $.response[404].json({ detail: "Unable to find requested asset." });
};

import type { ordersRetrieve } from "../../types/paths/orders/{order_id}.types.js";

export const GET: ordersRetrieve = async ($) => {
  const order = $.context.state.orders.find(
    (entry) => entry.public_id === $.path.order_id,
  );
  return order
    ? $.response[200].json(order)
    : $.response[404].json({ detail: "Unable to find requested asset." });
};

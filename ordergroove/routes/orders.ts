import type { ordersList } from "../types/paths/orders.types.js";

export const GET: ordersList = async ($) => {
  let orders = $.context.state.orders;
  if ($.query.customer !== undefined) {
    orders = orders.filter((entry) => entry.customer === $.query.customer);
  }
  if ($.query.status !== undefined) {
    orders = orders.filter((entry) => entry.status === $.query.status);
  }
  if ($.query.subscription !== undefined) {
    const orderIds = new Set(
      $.context.state.items
        .filter((entry) => entry.subscription === $.query.subscription)
        .map((entry) => entry.order),
    );
    orders = orders.filter((entry) => orderIds.has(entry.public_id));
  }

  return $.response[200].json(
    $.context.paginate(orders, {
      headers: $.headers,
      path: "/orders/",
      query: $.query,
    }),
  );
};

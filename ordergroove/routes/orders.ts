import type { ordersList } from "../types/paths/orders.types.js";
import { paginate } from "../domain/pagination.ts";

export const GET: ordersList = async ($) => {
  // Source: https://developer.ordergroove.com/reference/orders-list
  const orders = $.context.store.listOrders({
    customer: $.query.customer,
    subscription: $.query.subscription,
    status: $.query.status,
  });
  return $.response[200].json(
    paginate(
      orders,
      "orders",
      Number($.x.query.page_size ?? 10),
      $.x.query.cursor,
    ),
  );
};

import type { listOrders } from "../types/paths/orders.types.js";

// https://developer.ordergroove.com/reference/orders-list
// Only filters declared by the authoritative local OpenAPI contract are
// implemented; additional public-reference filters are recorded in
// DOCUMENTATION_DIFFERENCES.md.
export const GET: listOrders = async ($) => {
  return $.response[200].json({
    results: $.context.listOrders($.query),
    next: null,
    previous: null,
  } as never);
};

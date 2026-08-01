import type { listOrders } from "../types/paths/orders.types.js";

export const GET: listOrders = async ($) => {
  if (!$.context.isAuthorized($.auth.apiKey)) {
    return $.response[401].json({ error: "Unauthorized" });
  }

  return $.response[200].json({
    results: $.context.listOrders($.query),
    next: null,
    previous: null,
  } as never);
};

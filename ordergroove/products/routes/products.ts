import type { listProducts } from "../types/paths/products.types.js";

export const GET: listProducts = async ($) => {
  if (!$.context.isAuthorized($.auth.apiKey)) {
    return $.x.response[401].json({ error: "Unauthorized" });
  }

  return $.response[200].json({
    results: $.context.listProducts(),
    next: null,
    previous: null,
  } as never);
};

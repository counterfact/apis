import type { listProducts } from "../types/paths/products.types.js";

// https://developer.ordergroove.com/reference/products-list
// Public-reference filters and response expansions absent from OpenAPI are not
// simulated; see DOCUMENTATION_DIFFERENCES.md.
export const GET: listProducts = async ($) => {
  return $.response[200].json({
    results: $.context.listProducts(),
    next: null,
    previous: null,
  } as never);
};

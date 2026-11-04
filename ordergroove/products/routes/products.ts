import type { listProducts } from "../types/paths/products.types.js";

export const GET: listProducts = async ($) => {
  return $.response[200].json({
    results: $.context.listProducts(),
    next: null,
    previous: null,
  } as never);
};

import type { productsRetrieve } from "../../types/paths/products/{product_id}.types.js";

export const GET: productsRetrieve = async ($) => {
  // Source: https://developer.ordergroove.com/reference/products-retrieve
  const product = $.context.store.getProduct($.path.product_id);
  return product
    ? $.response[200].json(product)
    : $.response[404].json({ detail: "Unable to find requested asset." });
};

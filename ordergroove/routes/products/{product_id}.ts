import type { productsRetrieve } from "../../types/paths/products/{product_id}.types.js";

export const GET: productsRetrieve = async ($) => {
  const product = $.context.state.products.find(
    (entry) => entry.external_product_id === $.path.product_id,
  );
  return product
    ? $.response[200].json(product)
    : $.response[404].json({ detail: "Unable to find requested asset." });
};

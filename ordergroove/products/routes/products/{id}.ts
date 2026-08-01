import type { retrieveProduct } from "../../types/paths/products/{id}.types.js";
import type { updateProduct } from "../../types/paths/products/{id}.types.js";

// https://developer.ordergroove.com/reference/products-retrieve
export const GET: retrieveProduct = async ($) => {
  const product = $.context.getProduct($.path.id);
  return product
    ? $.response[200].json(product)
    : $.x.response[404].json({ error: "Product not found" });
};

// https://developer.ordergroove.com/reference/products-update
// OpenAPI declares PUT with a full Product body; the public reference declares
// PATCH with selected fields. OpenAPI takes precedence.
export const PUT: updateProduct = async ($) => {
  const product = $.context.replaceProduct($.path.id, $.body);
  return product
    ? $.response[200].json(product)
    : $.x.response[404].json({ error: "Product not found" });
};

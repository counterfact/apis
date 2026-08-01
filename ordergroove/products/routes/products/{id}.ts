import type { retrieveProduct } from "../../types/paths/products/{id}.types.js";
import type { updateProduct } from "../../types/paths/products/{id}.types.js";

export const GET: retrieveProduct = async ($) => {
  if (!$.context.isAuthorized($.auth.apiKey)) {
    return $.x.response[401].json({ error: "Unauthorized" });
  }

  const product = $.context.getProduct($.path.id);
  return product
    ? $.response[200].json(product)
    : $.x.response[404].json({ error: "Product not found" });
};

export const PUT: updateProduct = async ($) => {
  if (!$.context.isAuthorized($.auth.apiKey)) {
    return $.x.response[401].json({ error: "Unauthorized" });
  }

  const product = $.context.replaceProduct($.path.id, $.body);
  return product
    ? $.response[200].json(product)
    : $.x.response[404].json({ error: "Product not found" });
};

import type { productsRetrieve } from "../../types/paths/products/{product_id}.types.js";

export const GET: productsRetrieve = async ($) => {
  return $.response[200].random();
};

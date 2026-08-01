import type { retrieveProduct } from "../../types/paths/products/{id}.types.js";
import type { updateProduct } from "../../types/paths/products/{id}.types.js";

export const GET: retrieveProduct = async ($) => {
  return $.response[200].random();
};

export const PUT: updateProduct = async ($) => {
  return $.response[200].random();
};

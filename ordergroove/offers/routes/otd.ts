import type { listOneTimeDiscounts } from "../types/paths/otd.types.js";
import type { createOneTimeDiscount } from "../types/paths/otd.types.js";

export const GET: listOneTimeDiscounts = async ($) => {
  return $.response[200].random();
};

export const POST: createOneTimeDiscount = async ($) => {
  return $.response[201].random();
};

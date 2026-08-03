import type { customersCreate } from "../../types/paths/customers/create.types.js";

export const POST: customersCreate = async ($) => {
  return $.response[200].random();
};

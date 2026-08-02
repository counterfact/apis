import type { customersList } from "../types/paths/customers.types.js";

export const GET: customersList = async ($) => {
  return $.response[200].random();
};

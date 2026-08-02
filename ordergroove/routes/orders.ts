import type { ordersList } from "../types/paths/orders.types.js";

export const GET: ordersList = async ($) => {
  return $.response[200].random();
};

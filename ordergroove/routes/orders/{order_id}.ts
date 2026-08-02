import type { ordersRetrieve } from "../../types/paths/orders/{order_id}.types.js";

export const GET: ordersRetrieve = async ($) => {
  return $.response[200].random();
};

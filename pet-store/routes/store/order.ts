import type { placeOrder } from "../../types/paths/store/order.types.js";

export const POST: placeOrder = async ($) => {
  return $.response[200].random();
};

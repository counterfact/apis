import type { getOrderById } from "../../../types/paths/store/order/{orderId}.types.js";
import type { deleteOrder } from "../../../types/paths/store/order/{orderId}.types.js";

export const GET: getOrderById = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteOrder = async ($) => {
  return $.response[200].empty();
};

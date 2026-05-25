import type { getOrderById } from "../../../types/paths/store/order/{orderId}.types.js";
import type { deleteOrder } from "../../../types/paths/store/order/{orderId}.types.js";

export const GET: getOrderById = async ($) => {
  if (!Number.isInteger($.path.orderId) || $.path.orderId <= 0) {
    return $.response[400].empty();
  }

  const order = $.context.ordersById.get($.path.orderId);
  if (!order) {
    return $.response[404].empty();
  }

  return $.response[200].json(order);
};

export const DELETE: deleteOrder = async ($) => {
  if (!Number.isInteger($.path.orderId) || $.path.orderId <= 0) {
    return $.response[400].empty();
  }
  if (!$.context.ordersById.has($.path.orderId)) {
    return $.response[404].empty();
  }
  $.context.ordersById.delete($.path.orderId);
  return $.response[200].empty();
};

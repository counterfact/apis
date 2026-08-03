import type { ordersChangePayment } from "../../../types/paths/orders/{order_id}/change_payment.types.js";

export const PATCH: ordersChangePayment = async ($) => {
  return $.response[200].random();
};

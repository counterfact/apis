import type { ordersChangePayment } from "../../../types/paths/orders/{order_id}/change_payment.types.js";

export const PATCH: ordersChangePayment = async ($) => {
  const order = $.context.state.orders.find(
    (entry) => entry.public_id === $.path.order_id,
  );
  if (!order) {
    return $.response[404].json({ detail: "Unable to find requested asset." });
  }
  const payment = $.context.state.payments.find(
    (entry) => entry.public_id === $.body.payment,
  );
  if (!payment || !payment.live || payment.customer !== order.customer) {
    return $.response[400].json({ detail: "Invalid payment." });
  }

  order.payment = payment.public_id;
  return $.response[200].json(order);
};

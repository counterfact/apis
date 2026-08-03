import type { paymentsRetrieve } from "../../types/paths/payments/{payment_id}.types.js";

export const GET: paymentsRetrieve = async ($) => {
  // Source: https://developer.ordergroove.com/reference/payments-retrieve
  const payment = $.context.store.getPayment($.path.payment_id);
  return payment
    ? $.response[200].json(payment)
    : $.response[404].json({ detail: "Unable to find requested asset." });
};

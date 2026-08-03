import type { paymentsRetrieve } from "../../types/paths/payments/{payment_id}.types.js";

export const GET: paymentsRetrieve = async ($) => {
  const payment = $.context.state.payments.find(
    (entry) => entry.public_id === $.path.payment_id,
  );
  return payment
    ? $.response[200].json(payment)
    : $.response[404].json({ detail: "Unable to find requested asset." });
};

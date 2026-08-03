import type { subscriptionsChangePayment } from "../../../types/paths/subscriptions/{subscription_id}/change_payment.types.js";

export const PATCH: subscriptionsChangePayment = async ($) => {
  const subscription = $.context.state.subscriptions.find(
    (entry) => entry.public_id === $.path.subscription_id,
  );
  if (!subscription) {
    return $.response[404].json({ detail: "Unable to find requested asset." });
  }
  const payment = $.context.state.payments.find(
    (entry) => entry.public_id === $.body.payment,
  );
  if (!payment || !payment.live || payment.customer !== subscription.customer) {
    return $.response[400].json({ detail: "Invalid payment." });
  }

  subscription.payment = payment.public_id;
  return $.response[200].json(subscription);
};

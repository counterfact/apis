import type { subscriptionsChangePayment } from "../../../types/paths/subscriptions/{subscription_id}/change_payment.types.js";

export const PATCH: subscriptionsChangePayment = async ($) => {
  return $.response[200].random();
};

import type { cancelSubscription } from "../../../types/paths/subscriptions/{public_id}/cancel.types.js";

// https://developer.ordergroove.com/reference/subscriptions-cancel
// Ordergroove documents cancellation as PATCH and states it prevents future shipments.
export const PATCH: cancelSubscription = async ($) => {
  const subscription = $.context.cancelSubscription($.path.public_id);
  if (!subscription) {
    return $.x.response[404].json({ error: "Subscription not found" });
  }

  return $.response[200].json(subscription);
};

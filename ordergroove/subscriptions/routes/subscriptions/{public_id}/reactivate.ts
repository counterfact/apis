import type { reactivateSubscription } from "../../../types/paths/subscriptions/{public_id}/reactivate.types.js";

// https://developer.ordergroove.com/reference/subscriptions-reactivate
// Reactivation is PATCH; the full API requires the future cadence/start-date
// payload, which is outside this simulator's currently modeled subscription shape.
export const PATCH: reactivateSubscription = async ($) => {
  const subscription = $.context.reactivateSubscription($.path.public_id);
  if (!subscription) {
    return $.x.response[404].json({ error: "Subscription not found" });
  }

  return $.response[200].json(subscription);
};

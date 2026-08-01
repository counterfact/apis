import type { changeSubscriptionFrequency } from "../../../types/paths/subscriptions/{public_id}/change_frequency.types.js";

// https://developer.ordergroove.com/reference/subscriptions-change-frequency
// The documented cadence update is PATCH with `every` and `every_period`.
export const PATCH: changeSubscriptionFrequency = async ($) => {
  const subscription = $.context.changeSubscriptionFrequency(
    $.path.public_id,
    $.body,
  );
  if (!subscription) {
    return $.x.response[404].json({ error: "Subscription not found" });
  }

  return $.response[200].json(subscription);
};

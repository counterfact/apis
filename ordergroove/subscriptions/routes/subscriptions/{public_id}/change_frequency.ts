import type { changeSubscriptionFrequency } from "../../../types/paths/subscriptions/{public_id}/change_frequency.types.js";

export const POST: changeSubscriptionFrequency = async ($) => {
  const subscription = $.context.changeSubscriptionFrequency(
    $.path.public_id,
    $.body,
  );
  if (!subscription) {
    return $.x.response[404].json({ error: "Subscription not found" });
  }

  return $.response[200].json(subscription);
};

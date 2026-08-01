import type { cancelSubscription } from "../../../types/paths/subscriptions/{public_id}/cancel.types.js";

export const POST: cancelSubscription = async ($) => {
  if (!$.context.isAuthorized($.auth.apiKey)) {
    return $.x.response[401].json({ error: "Unauthorized" });
  }

  const subscription = $.context.cancelSubscription($.path.public_id);
  if (!subscription) {
    return $.x.response[404].json({ error: "Subscription not found" });
  }

  return $.response[200].json(subscription);
};

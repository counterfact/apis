import type { reactivateSubscription } from "../../../types/paths/subscriptions/{public_id}/reactivate.types.js";

export const POST: reactivateSubscription = async ($) => {
  if (!$.context.isAuthorized($.auth.apiKey)) {
    return $.x.response[401].json({ error: "Unauthorized" });
  }

  const subscription = $.context.reactivateSubscription($.path.public_id);
  if (!subscription) {
    return $.x.response[404].json({ error: "Subscription not found" });
  }

  return $.response[200].json(subscription);
};

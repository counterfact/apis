import type { retrieveSubscription } from "../../types/paths/subscriptions/{public_id}.types.js";
import type { updateSubscription } from "../../types/paths/subscriptions/{public_id}.types.js";

export const GET: retrieveSubscription = async ($) => {
  if (!$.context.isAuthorized($.auth.apiKey)) {
    return $.response[401].json({ error: "Unauthorized" });
  }

  const subscription = $.context.getSubscription($.path.public_id);
  if (!subscription) {
    return $.x.response[404].json({ error: "Subscription not found" });
  }

  return $.response[200].json(subscription);
};

export const PUT: updateSubscription = async ($) => {
  if (!$.context.isAuthorized($.auth.apiKey)) {
    return $.x.response[401].json({ error: "Unauthorized" });
  }

  const subscription = $.context.replaceSubscription($.path.public_id, $.body);
  if (!subscription) {
    return $.x.response[404].json({ error: "Subscription not found" });
  }

  return $.response[200].json(subscription);
};

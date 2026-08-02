import type { subscriptionsRetrieve } from "../../types/paths/subscriptions/{subscription_id}.types.js";

export const GET: subscriptionsRetrieve = async ($) => {
  // Source: https://developer.ordergroove.com/reference/subscriptions-retrieve
  const subscription = $.context.store.getSubscription($.path.subscription_id);
  return subscription
    ? $.response[200].json(subscription)
    : $.response[404].json({ detail: "Unable to find requested asset." });
};

import type { subscriptionsRetrieve } from "../../types/paths/subscriptions/{subscription_id}.types.js";

export const GET: subscriptionsRetrieve = async ($) => {
  const subscription = $.context.state.subscriptions.find(
    (entry) => entry.public_id === $.path.subscription_id,
  );
  return subscription
    ? $.response[200].json(subscription)
    : $.response[404].json({ detail: "Unable to find requested asset." });
};

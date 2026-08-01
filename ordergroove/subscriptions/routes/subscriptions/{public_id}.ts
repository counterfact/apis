import type { retrieveSubscription } from "../../types/paths/subscriptions/{public_id}.types.js";
import type { updateSubscription } from "../../types/paths/subscriptions/{public_id}.types.js";

// https://developer.ordergroove.com/reference/subscriptions-retrieve
export const GET: retrieveSubscription = async ($) => {
  const subscription = $.context.getSubscription($.path.public_id);
  if (!subscription) {
    return $.x.response[404].json({ error: "Subscription not found" });
  }

  return $.response[200].json(subscription);
};

// https://developer.ordergroove.com/reference/subscriptions-update
// The public reference documents PATCH on an /update/ action path. The local
// OpenAPI contract is authoritative here and instead declares PUT on this path;
// see DOCUMENTATION_DIFFERENCES.md.
export const PUT: updateSubscription = async ($) => {
  const subscription = $.context.replaceSubscription($.path.public_id, $.body);
  if (!subscription) {
    return $.x.response[404].json({ error: "Subscription not found" });
  }

  return $.response[200].json(subscription);
};

import type { subscriptionsChangeQuantity } from "../../../types/paths/subscriptions/{subscription_id}/change_quantity.types.js";

export const PATCH: subscriptionsChangeQuantity = async ($) => {
  const subscription = $.context.state.subscriptions.find(
    (entry) => entry.public_id === $.path.subscription_id,
  );
  if (!subscription) {
    return $.response[404].json({ detail: "Unable to find requested asset." });
  }
  if (subscription.prepaid_subscription_context !== undefined) {
    return $.response[400].json({
      detail: "Prepaid subscriptions cannot change quantity.",
    });
  }

  subscription.quantity = $.body.quantity;
  const unsentOrderIds = new Set(
    $.context.state.orders
      .filter((entry) => entry.status === 1)
      .map((entry) => entry.public_id),
  );
  for (const item of $.context.state.items) {
    if (
      item.subscription === subscription.public_id &&
      unsentOrderIds.has(item.order)
    ) {
      item.quantity = $.body.quantity;
    }
  }

  return $.response[200].json(subscription);
};

import type { skipSubscription } from "../../../types/paths/orders/{order_id}/skip_subscription.types.js";

export const PATCH: skipSubscription = async ($) => {
  const sourceOrder = $.context.state.orders.find(
    (entry) => entry.public_id === $.path.order_id,
  );
  if (!sourceOrder) {
    return $.response[404].json({ detail: "Unable to find requested asset." });
  }
  if (sourceOrder.status !== 1) {
    return $.response[400].json({
      detail: "Only unsent orders can be skipped.",
    });
  }
  const subscription = $.context.state.subscriptions.find(
    (entry) => entry.public_id === $.body.subscription,
  );
  if (!subscription) {
    return $.response[400].json({ detail: "Invalid subscription." });
  }
  const items = $.context.state.items.filter(
    (entry) =>
      entry.order === sourceOrder.public_id &&
      entry.subscription === subscription.public_id,
  );
  if (items.length === 0) {
    return $.response[400].json({
      detail: "Subscription is not in this order.",
    });
  }

  const nextOrder = {
    ...sourceOrder,
    public_id: `${sourceOrder.public_id}-skip-${subscription.public_id}`,
    place: $.context.nextOrderPlace(sourceOrder.place, subscription),
  };
  $.context.state.orders.push(nextOrder);
  for (const item of items) {
    item.order = nextOrder.public_id;
  }

  return $.response[200].json(sourceOrder);
};

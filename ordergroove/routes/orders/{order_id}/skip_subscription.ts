import type { skipSubscription } from "../../../types/paths/orders/{order_id}/skip_subscription.types.js";
import { DomainError } from "../../../domain/store.ts";

export const PATCH: skipSubscription = async ($) => {
  // Source: https://developer.ordergroove.com/reference/skip-subscription
  try {
    return $.response[200].json(
      $.context.store.skipSubscription($.path.order_id, $.body.subscription),
    );
  } catch (error) {
    if (error instanceof DomainError) {
      const response = error.status === 404 ? $.response[404] : $.response[400];
      return response.json({ detail: error.message });
    }
    throw error;
  }
};

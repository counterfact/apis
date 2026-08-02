import type { subscriptionsChangeQuantity } from "../../../types/paths/subscriptions/{subscription_id}/change_quantity.types.js";
import { DomainError } from "../../../domain/store.ts";

export const PATCH: subscriptionsChangeQuantity = async ($) => {
  // Source: https://developer.ordergroove.com/reference/subscriptions-change-quantity
  try {
    return $.response[200].json(
      $.context.store.changeSubscriptionQuantity(
        $.path.subscription_id,
        $.body.quantity,
      ),
    );
  } catch (error) {
    if (error instanceof DomainError) {
      const response = error.status === 404 ? $.response[404] : $.response[400];
      return response.json({ detail: error.message });
    }
    throw error;
  }
};

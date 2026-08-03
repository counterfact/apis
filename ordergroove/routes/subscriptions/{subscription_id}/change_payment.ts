import type { subscriptionsChangePayment } from "../../../types/paths/subscriptions/{subscription_id}/change_payment.types.js";
import { DomainError } from "../../../domain/store.ts";

export const PATCH: subscriptionsChangePayment = async ($) => {
  // Source: https://developer.ordergroove.com/reference/subscriptions-change-payment
  try {
    return $.response[200].json(
      $.context.store.changeSubscriptionPayment(
        $.path.subscription_id,
        $.body.payment,
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

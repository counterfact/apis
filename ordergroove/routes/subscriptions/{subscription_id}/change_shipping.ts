import type { subscriptionsChangeShippingAddress } from "../../../types/paths/subscriptions/{subscription_id}/change_shipping.types.js";
import { DomainError } from "../../../domain/store.ts";

export const PATCH: subscriptionsChangeShippingAddress = async ($) => {
  // Source: https://developer.ordergroove.com/reference/subscriptions-change-shipping-address
  try {
    return $.response[200].json(
      $.context.store.changeSubscriptionShippingAddress(
        $.path.subscription_id,
        $.body.shipping_address,
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

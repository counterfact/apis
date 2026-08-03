import type { subscriptionsChangeShippingAddress } from "../../../types/paths/subscriptions/{subscription_id}/change_shipping.types.js";

export const PATCH: subscriptionsChangeShippingAddress = async ($) => {
  return $.response[200].random();
};

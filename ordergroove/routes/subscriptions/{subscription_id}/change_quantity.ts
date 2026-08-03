import type { subscriptionsChangeQuantity } from "../../../types/paths/subscriptions/{subscription_id}/change_quantity.types.js";

export const PATCH: subscriptionsChangeQuantity = async ($) => {
  return $.response[200].random();
};

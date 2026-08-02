import type { skipSubscription } from "../../../types/paths/orders/{order_id}/skip_subscription.types.js";

export const PATCH: skipSubscription = async ($) => {
  return $.response[200].random();
};

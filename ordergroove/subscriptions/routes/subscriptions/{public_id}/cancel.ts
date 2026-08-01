import type { cancelSubscription } from "../../../types/paths/subscriptions/{public_id}/cancel.types.js";

export const POST: cancelSubscription = async ($) => {
  return $.response[200].random();
};

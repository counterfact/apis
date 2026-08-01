import type { reactivateSubscription } from "../../../types/paths/subscriptions/{public_id}/reactivate.types.js";

export const POST: reactivateSubscription = async ($) => {
  return $.response[200].random();
};

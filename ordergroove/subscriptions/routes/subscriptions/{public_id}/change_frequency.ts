import type { changeSubscriptionFrequency } from "../../../types/paths/subscriptions/{public_id}/change_frequency.types.js";

export const POST: changeSubscriptionFrequency = async ($) => {
  return $.response[200].random();
};

import type { subscriptionsRetrieve } from "../../types/paths/subscriptions/{subscription_id}.types.js";

export const GET: subscriptionsRetrieve = async ($) => {
  return $.response[200].random();
};

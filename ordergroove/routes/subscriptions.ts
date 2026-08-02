import type { subscriptionsList } from "../types/paths/subscriptions.types.js";

export const GET: subscriptionsList = async ($) => {
  return $.response[200].random();
};

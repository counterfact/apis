import type { retrieveSubscription } from "../../types/paths/subscriptions/{public_id}.types.js";
import type { updateSubscription } from "../../types/paths/subscriptions/{public_id}.types.js";

export const GET: retrieveSubscription = async ($) => {
  return $.response[200].random();
};

export const PUT: updateSubscription = async ($) => {
  return $.response[200].random();
};

import type { getAllWebhooks } from "../../../types/paths/api/v2/webhooks.types.js";
import type { postWebhook } from "../../../types/paths/api/v2/webhooks.types.js";

export const GET: getAllWebhooks = async ($) => {
  return $.response[200].random();
};

export const POST: postWebhook = async ($) => {
  return $.response[200].random();
};

import type { getWebhook } from "../../../../types/paths/api/v2/webhooks/{id}.types.js";
import type { patchWebhook } from "../../../../types/paths/api/v2/webhooks/{id}.types.js";
import type { deleteWebhook } from "../../../../types/paths/api/v2/webhooks/{id}.types.js";

export const GET: getWebhook = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchWebhook = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteWebhook = async ($) => {
  return $.response[204].empty();
};

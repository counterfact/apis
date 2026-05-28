import type { orgsListWebhooks } from "../../../types/paths/orgs/{org}/hooks.types.js";
import type { orgsCreateWebhook } from "../../../types/paths/orgs/{org}/hooks.types.js";

export const GET: orgsListWebhooks = async ($) => {
  return $.response[200].random();
};

export const POST: orgsCreateWebhook = async ($) => {
  return $.response[201].random();
};

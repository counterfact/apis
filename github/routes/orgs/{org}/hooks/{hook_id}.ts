import type { orgsGetWebhook } from "../../../../types/paths/orgs/{org}/hooks/{hook_id}.types.js";
import type { orgsUpdateWebhook } from "../../../../types/paths/orgs/{org}/hooks/{hook_id}.types.js";
import type { orgsDeleteWebhook } from "../../../../types/paths/orgs/{org}/hooks/{hook_id}.types.js";

export const GET: orgsGetWebhook = async ($) => {
  return $.response[200].random();
};

export const PATCH: orgsUpdateWebhook = async ($) => {
  return $.response[200].random();
};

export const DELETE: orgsDeleteWebhook = async ($) => {
  return $.response[204].empty();
};

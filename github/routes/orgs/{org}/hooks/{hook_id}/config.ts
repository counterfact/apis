import type { orgsGetWebhookConfigForOrg } from "../../../../../types/paths/orgs/{org}/hooks/{hook_id}/config.types.js";
import type { orgsUpdateWebhookConfigForOrg } from "../../../../../types/paths/orgs/{org}/hooks/{hook_id}/config.types.js";

export const GET: orgsGetWebhookConfigForOrg = async ($) => {
  return $.response[200].random();
};

export const PATCH: orgsUpdateWebhookConfigForOrg = async ($) => {
  return $.response[200].random();
};

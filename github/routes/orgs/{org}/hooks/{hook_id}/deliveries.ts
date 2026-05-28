import type { orgsListWebhookDeliveries } from "../../../../../types/paths/orgs/{org}/hooks/{hook_id}/deliveries.types.js";

export const GET: orgsListWebhookDeliveries = async ($) => {
  return $.response[200].random();
};

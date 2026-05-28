import type { orgsGetWebhookDelivery } from "../../../../../../types/paths/orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}.types.js";

export const GET: orgsGetWebhookDelivery = async ($) => {
  return $.response[200].random();
};

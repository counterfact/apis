import type { reposGetWebhookDelivery } from "../../../../../../../types/paths/repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}.types.js";

export const GET: reposGetWebhookDelivery = async ($) => {
  return $.response[200].random();
};

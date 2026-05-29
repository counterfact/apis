import type { reposListWebhookDeliveries } from "../../../../../../types/paths/repos/{owner}/{repo}/hooks/{hook_id}/deliveries.types.js";

export const GET: reposListWebhookDeliveries = async ($) => {
  return $.response[200].random();
};

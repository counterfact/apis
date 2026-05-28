import type { reposRedeliverWebhookDelivery } from "../../../../../../../../types/paths/repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}/attempts.types.js";

export const POST: reposRedeliverWebhookDelivery = async ($) => {
  return $.response[202].empty();
};

import type { orgsRedeliverWebhookDelivery } from "../../../../../../../types/paths/orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}/attempts.types.js";

export const POST: orgsRedeliverWebhookDelivery = async ($) => {
  return $.response[202].empty();
};

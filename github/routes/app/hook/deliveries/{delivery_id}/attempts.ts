import type { appsRedeliverWebhookDelivery } from "../../../../../types/paths/app/hook/deliveries/{delivery_id}/attempts.types.js";

export const POST: appsRedeliverWebhookDelivery = async ($) => {
  return $.response[202].empty();
};

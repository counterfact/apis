import type { appsGetWebhookDelivery } from "../../../../types/paths/app/hook/deliveries/{delivery_id}.types.js";

export const GET: appsGetWebhookDelivery = async ($) => {
  return $.response[200].random();
};

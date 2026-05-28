import type { appsListWebhookDeliveries } from "../../../types/paths/app/hook/deliveries.types.js";

export const GET: appsListWebhookDeliveries = async ($) => {
  return $.response[200].random();
};

import type { appsGetWebhookConfigForApp } from "../../../types/paths/app/hook/config.types.js";
import type { appsUpdateWebhookConfigForApp } from "../../../types/paths/app/hook/config.types.js";

export const GET: appsGetWebhookConfigForApp = async ($) => {
  return $.response[200].random();
};

export const PATCH: appsUpdateWebhookConfigForApp = async ($) => {
  return $.response[200].random();
};

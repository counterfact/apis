import type { Routes } from "../../types/index.js";
type Route = Routes["/workspace"]["/webhooks"];
export const GET: Route["GET"] = async ($) => {
  const context = $.context;
  return $.response.status(200).json(context.listWebhooks($.query.include_usages));
};
export const POST: Route["POST"] = async ($) => {
  const context = $.context;
  return $.response.status(200).json(context.createWebhook($.body));
};

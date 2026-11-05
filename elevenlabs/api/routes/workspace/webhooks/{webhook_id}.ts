import type { Routes } from "../../../types/index.js";
type Route = Routes["/workspace"]["/webhooks"]["/{webhook_id}"];
export const PATCH: Route["PATCH"] = async ($) => {
  const result = $.context.updateWebhook($.path.webhook_id, $.body);
  if (!result) return $.x.response.status(404).json({ detail: { status: "webhook_not_found", message: "Webhook not found" } });
  return $.response.status(200).json(result);
};
export const DELETE: Route["DELETE"] = async ($) => {
  const result = $.context.deleteWebhook($.path.webhook_id);
  if (!result) return $.x.response.status(404).json({ detail: { status: "webhook_not_found", message: "Webhook not found" } });
  return $.response.status(200).json(result);
};

import type { Context } from "./webhooks/_.context.js";
import type { Routes } from "../../types/index.js";
type Route = Routes["/workspace"]["/webhooks"];
export const GET: Route["GET"] = async ($) => {
  // Collection handlers use the parent's generated context type; runtime uses the child.
  const context = $.x.context as Context;
  return $.response.status(200).json(context.listWebhooks($.query.include_usages));
};
export const POST: Route["POST"] = async ($) => {
  const context = $.x.context as Context;
  return $.response.status(200).json(context.createWebhook($.body));
};

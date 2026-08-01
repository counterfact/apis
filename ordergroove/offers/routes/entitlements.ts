import type { listEntitlements } from "../types/paths/entitlements.types.js";

export const GET: listEntitlements = async ($) => {
  if (!$.context.isAuthorized($.auth.apiKey)) {
    return $.x.response[401].json({ error: "Unauthorized" });
  }

  return $.response[200].json({
    results: $.context.listEntitlements($.query.customer),
  });
};

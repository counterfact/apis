// https://developer.ordergroove.com/reference/authentication
// The authoritative OpenAPI contract models only Application x-api-key auth.
import type { Middleware } from "../types/_.middleware.js";

export const middleware: Middleware = async ($, respondTo) => {
  if (!$.context.isAuthorized($.auth.apiKey)) {
    return $.response[401].json({ error: "Unauthorized" });
  }

  return respondTo($);
};

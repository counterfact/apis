// https://developer.ordergroove.com/reference/authentication
// This simulator implements the OpenAPI contract's Application API x-api-key
// scheme. The separately documented Storefront HMAC scope is not in that contract.
import type { Middleware } from "../types/_.middleware.js";

export const middleware: Middleware = async ($, respondTo) => {
  if (!$.context.isAuthorized($.auth.apiKey)) {
    return $.response[401].json({ error: "Unauthorized" });
  }

  return respondTo($);
};

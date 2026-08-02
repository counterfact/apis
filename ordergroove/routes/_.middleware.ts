import type { Middleware } from "../types/_.middleware.ts";

export const middleware: Middleware = async ($, respondTo) => {
  // Source: https://developer.ordergroove.com/reference/authentication
  // Initial simulator implements only its documented Application API key scope.
  const key = $.auth?.apiKey ?? $.headers["x-api-key"];
  if (key !== "ordergroove-simulator-key") {
    return $.response[403].json({ detail: "Authentication Failed" });
  }
  return respondTo($);
};

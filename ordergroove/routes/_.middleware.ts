import type { Middleware } from "../types/_.middleware.js";

export const middleware: Middleware = async ($, respondTo) => {
  if (!$.context.isAuthorized($.auth?.apiKey)) {
    return $.response[403].json({ detail: "Authentication Failed" });
  }

  return respondTo($);
};

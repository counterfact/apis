import type { Middleware } from "../types/_.middleware.js";

/**
 * The simulator deliberately models one local credential, not LaunchDarkly's
 * token, role, cookie, or permission systems.
 */
export const middleware: Middleware = async ($, respondTo) => {
  if (!$.context.isAuthorized($.auth?.apiKey)) {
    return $.response[401].json({
      code: "unauthorized",
      message: "Invalid simulator access token",
    });
  }

  return respondTo($);
};

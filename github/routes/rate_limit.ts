import type { rateLimitGet } from "../types/paths/rate_limit.types.js";

export const GET: rateLimitGet = ($) => {
  const overview = $.context.getRateLimitOverview();
  const core = overview.resources.core;

  return $.response[200]
    .header("X-RateLimit-Limit", core.limit)
    .header("X-RateLimit-Remaining", core.remaining)
    .header("X-RateLimit-Reset", core.reset)
    .json(overview);
};

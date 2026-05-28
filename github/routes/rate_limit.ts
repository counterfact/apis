import type { rateLimitGet } from "../types/paths/rate_limit.types.js";

export const GET: rateLimitGet = async ($) => {
  return $.response[200].random();
};

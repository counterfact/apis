import type { postDestination } from "../../../../../types/paths/api/v2/destinations/{projectKey}/{environmentKey}.types.js";

export const POST: postDestination = async ($) => {
  return $.response[201].random();
};

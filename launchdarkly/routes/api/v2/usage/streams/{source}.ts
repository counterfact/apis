import type { getStreamUsage } from "../../../../../types/paths/api/v2/usage/streams/{source}.types.js";

export const GET: getStreamUsage = async ($) => {
  return $.response[200].random();
};

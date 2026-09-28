import type { getEventsUsage } from "../../../../../types/paths/api/v2/usage/events/{type}.types.js";

export const GET: getEventsUsage = async ($) => {
  return $.response[200].random();
};

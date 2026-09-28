import type { getFlagEvents } from "../../../../types/paths/api/v2/engineering-insights/flag-events.types.js";

export const GET: getFlagEvents = async ($) => {
  return $.response[200].random();
};

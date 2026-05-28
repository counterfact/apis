import type { activityListPublicEvents } from "../types/paths/events.types.js";

export const GET: activityListPublicEvents = async ($) => {
  return $.response[200].random();
};

import type { activityGetFeeds } from "../types/paths/feeds.types.js";

export const GET: activityGetFeeds = async ($) => {
  return $.response[200].random();
};

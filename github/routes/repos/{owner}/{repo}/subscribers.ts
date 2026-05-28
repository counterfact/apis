import type { activityListWatchersForRepo } from "../../../../types/paths/repos/{owner}/{repo}/subscribers.types.js";

export const GET: activityListWatchersForRepo = async ($) => {
  return $.response[200].random();
};

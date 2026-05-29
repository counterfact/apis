import type { activityListRepoEvents } from "../../../../types/paths/repos/{owner}/{repo}/events.types.js";

export const GET: activityListRepoEvents = async ($) => {
  return $.response[200].random();
};

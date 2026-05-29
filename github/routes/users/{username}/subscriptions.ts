import type { activityListReposWatchedByUser } from "../../../types/paths/users/{username}/subscriptions.types.js";

export const GET: activityListReposWatchedByUser = async ($) => {
  return $.response[200].random();
};

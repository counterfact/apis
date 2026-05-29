import type { activityListReposStarredByUser } from "../../../types/paths/users/{username}/starred.types.js";

export const GET: activityListReposStarredByUser = async ($) => {
  return $.response[200].random();
};

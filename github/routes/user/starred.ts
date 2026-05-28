import type { activityListReposStarredByAuthenticatedUser } from "../../types/paths/user/starred.types.js";

export const GET: activityListReposStarredByAuthenticatedUser = async ($) => {
  return $.response[200].random();
};

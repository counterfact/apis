import type { activityCheckRepoIsStarredByAuthenticatedUser } from "../../../../types/paths/user/starred/{owner}/{repo}.types.js";
import type { activityStarRepoForAuthenticatedUser } from "../../../../types/paths/user/starred/{owner}/{repo}.types.js";
import type { activityUnstarRepoForAuthenticatedUser } from "../../../../types/paths/user/starred/{owner}/{repo}.types.js";

export const GET: activityCheckRepoIsStarredByAuthenticatedUser = async ($) => {
  return $.response[204].empty();
};

export const PUT: activityStarRepoForAuthenticatedUser = async ($) => {
  return $.response[204].empty();
};

export const DELETE: activityUnstarRepoForAuthenticatedUser = async ($) => {
  return $.response[204].empty();
};

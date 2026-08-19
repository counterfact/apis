import type { activityCheckRepoIsStarredByAuthenticatedUser } from "../../../../types/paths/user/starred/{owner}/{repo}.types.js";
import type { activityStarRepoForAuthenticatedUser } from "../../../../types/paths/user/starred/{owner}/{repo}.types.js";
import type { activityUnstarRepoForAuthenticatedUser } from "../../../../types/paths/user/starred/{owner}/{repo}.types.js";

export const GET: activityCheckRepoIsStarredByAuthenticatedUser = async ($) => {
  return $.context.isStarred($.path.owner, $.path.repo)
    ? $.response[204].empty()
    : $.response[404].empty();
};

export const PUT: activityStarRepoForAuthenticatedUser = async ($) => {
  $.context.starRepo($.path.owner, $.path.repo);
  return $.response[204].empty();
};

export const DELETE: activityUnstarRepoForAuthenticatedUser = async ($) => {
  $.context.unstarRepo($.path.owner, $.path.repo);
  return $.response[204].empty();
};

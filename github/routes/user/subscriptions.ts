import type { activityListWatchedReposForAuthenticatedUser } from "../../types/paths/user/subscriptions.types.js";

export const GET: activityListWatchedReposForAuthenticatedUser = async ($) => {
  return $.response[200].json($.context.listSubscriptions($.query));
};

import type { usersListFollowedByAuthenticatedUser } from "../../types/paths/user/following.types.js";

export const GET: usersListFollowedByAuthenticatedUser = async ($) => {
  return $.response[200].json($.context.listFollowing($.query));
};

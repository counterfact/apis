import type { usersListFollowersForAuthenticatedUser } from "../../types/paths/user/followers.types.js";

export const GET: usersListFollowersForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};

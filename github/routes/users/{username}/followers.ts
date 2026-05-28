import type { usersListFollowersForUser } from "../../../types/paths/users/{username}/followers.types.js";

export const GET: usersListFollowersForUser = async ($) => {
  return $.response[200].random();
};

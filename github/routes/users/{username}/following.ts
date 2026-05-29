import type { usersListFollowingForUser } from "../../../types/paths/users/{username}/following.types.js";

export const GET: usersListFollowingForUser = async ($) => {
  return $.response[200].random();
};

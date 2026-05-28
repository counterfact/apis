import type { usersCheckFollowingForUser } from "../../../../types/paths/users/{username}/following/{target_user}.types.js";

export const GET: usersCheckFollowingForUser = async ($) => {
  return $.response[204].empty();
};

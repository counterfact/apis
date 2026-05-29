import type { usersGetByUsername } from "../../types/paths/users/{username}.types.js";

export const GET: usersGetByUsername = async ($) => {
  const user = $.context.getUser($.path.username);
  if (!user) {
    return $.response[404].empty();
  }
  return $.response[200].json(user);
};

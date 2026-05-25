import type { loginUser } from "../../types/paths/user/login.types.js";

export const GET: loginUser = async ($) => {
  if (!$.query.username || !$.query.password) {
    return $.response[400].empty();
  }

  const user = $.context.usersByUsername.get($.query.username);
  if (!user || user.password !== $.query.password) {
    return $.response[400].empty();
  }

  return $.response[200]
    .header("X-Rate-Limit", 1000)
    .header("X-Expires-After", new Date(Date.now() + 60_000).toISOString())
    .json(`logged in user session:${$.query.username}`);
};

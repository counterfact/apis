import type { loginUser } from "../../types/paths/user/login.types.js";

const DEFAULT_RATE_LIMIT = 1000;
const SESSION_DURATION_MS = 60_000;

export const GET: loginUser = async ($) => {
  if (!$.query.username || !$.query.password) {
    return $.response[400].empty();
  }

  const user = $.context.usersByUsername.get($.query.username);
  if (!user || user.password !== $.query.password) {
    return $.response[400].empty();
  }

  return $.response[200]
    .header("X-Rate-Limit", DEFAULT_RATE_LIMIT)
    .header(
      "X-Expires-After",
      new Date(Date.now() + SESSION_DURATION_MS).toISOString(),
    )
    .json(`logged in user session:${$.query.username}`);
};

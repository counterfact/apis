import type { usersCheckPersonIsFollowedByAuthenticated } from "../../../types/paths/user/following/{username}.types.js";
import type { usersFollow } from "../../../types/paths/user/following/{username}.types.js";
import type { usersUnfollow } from "../../../types/paths/user/following/{username}.types.js";

export const GET: usersCheckPersonIsFollowedByAuthenticated = async ($) => {
  if (!$.context.getUser($.path.username)) {
    return $.response[404].json({ message: "Not Found", status: "404" });
  }
  return $.context.isFollowing($.path.username)
    ? $.response[204].empty()
    : $.response[404].json({ message: "Not Found", status: "404" });
};

export const PUT: usersFollow = async ($) => {
  if (!$.context.getUser($.path.username)) {
    return $.response[404].json({ message: "Not Found", status: "404" });
  }
  $.context.follow($.path.username);
  return $.response[204].empty();
};

export const DELETE: usersUnfollow = async ($) => {
  if (!$.context.getUser($.path.username)) {
    return $.response[404].json({ message: "Not Found", status: "404" });
  }
  $.context.unfollow($.path.username);
  return $.response[204].empty();
};

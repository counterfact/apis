import type { usersCheckPersonIsFollowedByAuthenticated } from "../../../types/paths/user/following/{username}.types.js";
import type { usersFollow } from "../../../types/paths/user/following/{username}.types.js";
import type { usersUnfollow } from "../../../types/paths/user/following/{username}.types.js";

export const GET: usersCheckPersonIsFollowedByAuthenticated = async ($) => {
  return $.context.isFollowing($.path.username)
    ? $.response[204].empty()
    : $.response[404].empty();
};

export const PUT: usersFollow = async ($) => {
  $.context.follow($.path.username);
  return $.response[204].empty();
};

export const DELETE: usersUnfollow = async ($) => {
  $.context.unfollow($.path.username);
  return $.response[204].empty();
};

import type { usersCheckPersonIsFollowedByAuthenticated } from "../../../types/paths/user/following/{username}.types.js";
import type { usersFollow } from "../../../types/paths/user/following/{username}.types.js";
import type { usersUnfollow } from "../../../types/paths/user/following/{username}.types.js";

export const GET: usersCheckPersonIsFollowedByAuthenticated = async ($) => {
  return $.response[204].empty();
};

export const PUT: usersFollow = async ($) => {
  return $.response[204].empty();
};

export const DELETE: usersUnfollow = async ($) => {
  return $.response[204].empty();
};

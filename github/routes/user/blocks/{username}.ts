import type { usersCheckBlocked } from "../../../types/paths/user/blocks/{username}.types.js";
import type { usersBlock } from "../../../types/paths/user/blocks/{username}.types.js";
import type { usersUnblock } from "../../../types/paths/user/blocks/{username}.types.js";

export const GET: usersCheckBlocked = async ($) => {
  return $.response[204].empty();
};

export const PUT: usersBlock = async ($) => {
  return $.response[204].empty();
};

export const DELETE: usersUnblock = async ($) => {
  return $.response[204].empty();
};

import type { usersListBlockedByAuthenticatedUser } from "../../types/paths/user/blocks.types.js";

export const GET: usersListBlockedByAuthenticatedUser = async ($) => {
  return $.response[200].random();
};

import type { usersGetContextForUser } from "../../../types/paths/users/{username}/hovercard.types.js";

export const GET: usersGetContextForUser = async ($) => {
  return $.response[200].random();
};

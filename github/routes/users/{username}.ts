import type { usersGetByUsername } from "../../types/paths/users/{username}.types.js";

export const GET: usersGetByUsername = async ($) => {
  return $.response[200].random();
};

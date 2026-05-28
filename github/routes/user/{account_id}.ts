import type { usersGetById } from "../../types/paths/user/{account_id}.types.js";

export const GET: usersGetById = async ($) => {
  return $.response[200].random();
};

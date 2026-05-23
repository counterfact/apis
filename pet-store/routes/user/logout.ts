import type { logoutUser } from "../../types/paths/user/logout.types.js";

export const GET: logoutUser = async ($) => {
  return $.response[200].empty();
};

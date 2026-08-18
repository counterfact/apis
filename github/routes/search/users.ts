import type { searchUsers } from "../../types/paths/search/users.types.js";

export const GET: searchUsers = async ($) => {
  return $.response[200].json($.context.searchUsers($.query));
};

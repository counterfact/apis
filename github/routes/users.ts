import type { usersList } from "../types/paths/users.types.js";

export const GET: usersList = async ($) => {
  return $.response[200].json($.context.listSimpleUsers($.query));
};

import type { getSearchUsers } from "../../../../../types/paths/api/v2/user-search/{projectKey}/{environmentKey}.types.js";

export const GET: getSearchUsers = async ($) => {
  return $.response[200].random();
};

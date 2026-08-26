import type { getUsers } from "../../../../../types/paths/api/v2/users/{projectKey}/{environmentKey}.types.js";

export const GET: getUsers = async ($) => {
  return $.response[200].random();
};

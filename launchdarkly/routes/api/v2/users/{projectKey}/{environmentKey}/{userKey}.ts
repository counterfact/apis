import type { getUser } from "../../../../../../types/paths/api/v2/users/{projectKey}/{environmentKey}/{userKey}.types.js";
import type { deleteUser } from "../../../../../../types/paths/api/v2/users/{projectKey}/{environmentKey}/{userKey}.types.js";

export const GET: getUser = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteUser = async ($) => {
  return $.response[204].empty();
};

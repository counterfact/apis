import type { getUserAttributeNames } from "../../../../../types/paths/api/v2/user-attributes/{projectKey}/{environmentKey}.types.js";

export const GET: getUserAttributeNames = async ($) => {
  return $.response[200].random();
};

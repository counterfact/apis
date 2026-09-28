import type { getUserFlagSettings } from "../../../../../../../types/paths/api/v2/users/{projectKey}/{environmentKey}/{userKey}/flags.types.js";

export const GET: getUserFlagSettings = async ($) => {
  return $.response[200].random();
};

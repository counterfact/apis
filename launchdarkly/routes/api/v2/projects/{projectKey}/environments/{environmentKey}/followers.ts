import type { getFollowersByProjEnv } from "../../../../../../../types/paths/api/v2/projects/{projectKey}/environments/{environmentKey}/followers.types.js";

export const GET: getFollowersByProjEnv = async ($) => {
  return $.response[200].random();
};

import type { getFlagFollowers } from "../../../../../../../../../types/paths/api/v2/projects/{projectKey}/flags/{featureFlagKey}/environments/{environmentKey}/followers.types.js";

export const GET: getFlagFollowers = async ($) => {
  return $.response[200].random();
};

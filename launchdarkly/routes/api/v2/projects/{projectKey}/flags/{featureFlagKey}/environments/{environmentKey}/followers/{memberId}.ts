import type { putFlagFollowers } from "../../../../../../../../../../types/paths/api/v2/projects/{projectKey}/flags/{featureFlagKey}/environments/{environmentKey}/followers/{memberId}.types.js";
import type { deleteFlagFollowers } from "../../../../../../../../../../types/paths/api/v2/projects/{projectKey}/flags/{featureFlagKey}/environments/{environmentKey}/followers/{memberId}.types.js";

export const PUT: putFlagFollowers = async ($) => {
  return $.response[204].empty();
};

export const DELETE: deleteFlagFollowers = async ($) => {
  return $.response[204].empty();
};

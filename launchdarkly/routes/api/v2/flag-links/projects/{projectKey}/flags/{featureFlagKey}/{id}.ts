import type { updateFlagLink } from "../../../../../../../../types/paths/api/v2/flag-links/projects/{projectKey}/flags/{featureFlagKey}/{id}.types.js";
import type { deleteFlagLink } from "../../../../../../../../types/paths/api/v2/flag-links/projects/{projectKey}/flags/{featureFlagKey}/{id}.types.js";

export const PATCH: updateFlagLink = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteFlagLink = async ($) => {
  return $.response[204].empty();
};

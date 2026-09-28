import type { getFlagLinks } from "../../../../../../../types/paths/api/v2/flag-links/projects/{projectKey}/flags/{featureFlagKey}.types.js";
import type { createFlagLink } from "../../../../../../../types/paths/api/v2/flag-links/projects/{projectKey}/flags/{featureFlagKey}.types.js";

export const GET: getFlagLinks = async ($) => {
  return $.response[200].random();
};

export const POST: createFlagLink = async ($) => {
  return $.response[201].random();
};

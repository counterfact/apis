import type { getFlagConfigScheduledChanges } from "../../../../../../../../../types/paths/api/v2/projects/{projectKey}/flags/{featureFlagKey}/environments/{environmentKey}/scheduled-changes.types.js";
import type { postFlagConfigScheduledChanges } from "../../../../../../../../../types/paths/api/v2/projects/{projectKey}/flags/{featureFlagKey}/environments/{environmentKey}/scheduled-changes.types.js";

export const GET: getFlagConfigScheduledChanges = async ($) => {
  return $.response[200].random();
};

export const POST: postFlagConfigScheduledChanges = async ($) => {
  return $.response[201].random();
};

import type { getFeatureFlagScheduledChange } from "../../../../../../../../../../types/paths/api/v2/projects/{projectKey}/flags/{featureFlagKey}/environments/{environmentKey}/scheduled-changes/{id}.types.js";
import type { patchFlagConfigScheduledChange } from "../../../../../../../../../../types/paths/api/v2/projects/{projectKey}/flags/{featureFlagKey}/environments/{environmentKey}/scheduled-changes/{id}.types.js";
import type { deleteFlagConfigScheduledChanges } from "../../../../../../../../../../types/paths/api/v2/projects/{projectKey}/flags/{featureFlagKey}/environments/{environmentKey}/scheduled-changes/{id}.types.js";

export const GET: getFeatureFlagScheduledChange = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchFlagConfigScheduledChange = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteFlagConfigScheduledChanges = async ($) => {
  return $.response[204].empty();
};

import type { putContextFlagSetting } from "../../../../../../../../../../../types/paths/api/v2/projects/{projectKey}/environments/{environmentKey}/contexts/{contextKind}/{contextKey}/flags/{featureFlagKey}.types.js";

export const PUT: putContextFlagSetting = async ($) => {
  return $.response[204].empty();
};

import type { copyFeatureFlag } from "../../../../../../types/paths/api/v2/flags/{projectKey}/{featureFlagKey}/copy.types.js";

export const POST: copyFeatureFlag = async ($) => {
  return $.response[201].random();
};

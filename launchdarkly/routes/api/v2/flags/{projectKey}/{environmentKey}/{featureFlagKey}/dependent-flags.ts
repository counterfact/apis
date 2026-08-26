import type { getDependentFlagsByEnv } from "../../../../../../../types/paths/api/v2/flags/{projectKey}/{environmentKey}/{featureFlagKey}/dependent-flags.types.js";

export const GET: getDependentFlagsByEnv = async ($) => {
  return $.response[200].random();
};

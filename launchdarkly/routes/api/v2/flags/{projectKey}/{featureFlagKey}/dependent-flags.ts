import type { getDependentFlags } from "../../../../../../types/paths/api/v2/flags/{projectKey}/{featureFlagKey}/dependent-flags.types.js";

export const GET: getDependentFlags = async ($) => {
  return $.response[200].random();
};

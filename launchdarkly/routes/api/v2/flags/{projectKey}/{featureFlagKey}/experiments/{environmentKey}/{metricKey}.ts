import type { getLegacyExperimentResults } from "../../../../../../../../types/paths/api/v2/flags/{projectKey}/{featureFlagKey}/experiments/{environmentKey}/{metricKey}.types.js";

export const GET: getLegacyExperimentResults = async ($) => {
  return $.response[200].random();
};

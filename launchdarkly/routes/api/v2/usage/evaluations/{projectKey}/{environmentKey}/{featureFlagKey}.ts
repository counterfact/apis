import type { getEvaluationsUsage } from "../../../../../../../types/paths/api/v2/usage/evaluations/{projectKey}/{environmentKey}/{featureFlagKey}.types.js";

export const GET: getEvaluationsUsage = async ($) => {
  return $.response[200].random();
};

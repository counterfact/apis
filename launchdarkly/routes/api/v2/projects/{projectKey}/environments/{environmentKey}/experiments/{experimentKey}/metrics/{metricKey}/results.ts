import type { getExperimentResults } from "../../../../../../../../../../../types/paths/api/v2/projects/{projectKey}/environments/{environmentKey}/experiments/{experimentKey}/metrics/{metricKey}/results.types.js";

export const GET: getExperimentResults = async ($) => {
  return $.response[200].random();
};

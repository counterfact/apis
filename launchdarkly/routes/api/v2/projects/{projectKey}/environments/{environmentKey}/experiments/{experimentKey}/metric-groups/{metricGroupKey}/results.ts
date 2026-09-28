import type { getExperimentResultsForMetricGroup } from "../../../../../../../../../../../types/paths/api/v2/projects/{projectKey}/environments/{environmentKey}/experiments/{experimentKey}/metric-groups/{metricGroupKey}/results.types.js";

export const GET: getExperimentResultsForMetricGroup = async ($) => {
  return $.response[200].random();
};

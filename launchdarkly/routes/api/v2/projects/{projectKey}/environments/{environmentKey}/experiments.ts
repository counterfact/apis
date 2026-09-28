import type { getExperiments } from "../../../../../../../types/paths/api/v2/projects/{projectKey}/environments/{environmentKey}/experiments.types.js";
import type { createExperiment } from "../../../../../../../types/paths/api/v2/projects/{projectKey}/environments/{environmentKey}/experiments.types.js";

export const GET: getExperiments = async ($) => {
  return $.response[200].random();
};

export const POST: createExperiment = async ($) => {
  return $.response[201].random();
};

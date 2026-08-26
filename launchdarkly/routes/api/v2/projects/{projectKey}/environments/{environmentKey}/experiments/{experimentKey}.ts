import type { getExperiment } from "../../../../../../../../types/paths/api/v2/projects/{projectKey}/environments/{environmentKey}/experiments/{experimentKey}.types.js";
import type { patchExperiment } from "../../../../../../../../types/paths/api/v2/projects/{projectKey}/environments/{environmentKey}/experiments/{experimentKey}.types.js";

export const GET: getExperiment = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchExperiment = async ($) => {
  return $.response[200].random();
};

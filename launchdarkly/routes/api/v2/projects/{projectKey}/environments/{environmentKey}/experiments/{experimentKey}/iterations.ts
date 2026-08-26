import type { createIteration } from "../../../../../../../../../types/paths/api/v2/projects/{projectKey}/environments/{environmentKey}/experiments/{experimentKey}/iterations.types.js";

export const POST: createIteration = async ($) => {
  return $.response[200].random();
};

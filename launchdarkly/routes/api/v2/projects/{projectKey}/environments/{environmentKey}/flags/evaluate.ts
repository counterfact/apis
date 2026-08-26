import type { evaluateContextInstance } from "../../../../../../../../types/paths/api/v2/projects/{projectKey}/environments/{environmentKey}/flags/evaluate.types.js";

export const POST: evaluateContextInstance = async ($) => {
  return $.response[200].random();
};

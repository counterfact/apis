import type { getEnvironment } from "../../../../../../types/paths/api/v2/projects/{projectKey}/environments/{environmentKey}.types.js";
import type { patchEnvironment } from "../../../../../../types/paths/api/v2/projects/{projectKey}/environments/{environmentKey}.types.js";
import type { deleteEnvironment } from "../../../../../../types/paths/api/v2/projects/{projectKey}/environments/{environmentKey}.types.js";

export const GET: getEnvironment = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchEnvironment = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteEnvironment = async ($) => {
  return $.response[204].empty();
};

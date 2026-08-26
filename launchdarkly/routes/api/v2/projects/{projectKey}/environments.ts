import type { getEnvironmentsByProject } from "../../../../../types/paths/api/v2/projects/{projectKey}/environments.types.js";
import type { postEnvironment } from "../../../../../types/paths/api/v2/projects/{projectKey}/environments.types.js";

export const GET: getEnvironmentsByProject = async ($) => {
  return $.response[200].random();
};

export const POST: postEnvironment = async ($) => {
  return $.response[201].random();
};

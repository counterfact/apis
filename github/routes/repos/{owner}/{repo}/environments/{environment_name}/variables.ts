import type { actionsListEnvironmentVariables } from "../../../../../../types/paths/repos/{owner}/{repo}/environments/{environment_name}/variables.types.js";
import type { actionsCreateEnvironmentVariable } from "../../../../../../types/paths/repos/{owner}/{repo}/environments/{environment_name}/variables.types.js";

export const GET: actionsListEnvironmentVariables = async ($) => {
  return $.response[200].random();
};

export const POST: actionsCreateEnvironmentVariable = async ($) => {
  return $.response[201].random();
};

import type { actionsGetEnvironmentVariable } from "../../../../../../../types/paths/repos/{owner}/{repo}/environments/{environment_name}/variables/{name}.types.js";
import type { actionsUpdateEnvironmentVariable } from "../../../../../../../types/paths/repos/{owner}/{repo}/environments/{environment_name}/variables/{name}.types.js";
import type { actionsDeleteEnvironmentVariable } from "../../../../../../../types/paths/repos/{owner}/{repo}/environments/{environment_name}/variables/{name}.types.js";

export const GET: actionsGetEnvironmentVariable = async ($) => {
  return $.response[200].random();
};

export const PATCH: actionsUpdateEnvironmentVariable = async ($) => {
  return $.response[204].empty();
};

export const DELETE: actionsDeleteEnvironmentVariable = async ($) => {
  return $.response[204].empty();
};

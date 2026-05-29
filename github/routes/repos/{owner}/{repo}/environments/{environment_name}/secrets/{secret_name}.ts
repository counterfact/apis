import type { actionsGetEnvironmentSecret } from "../../../../../../../types/paths/repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}.types.js";
import type { actionsCreateOrUpdateEnvironmentSecret } from "../../../../../../../types/paths/repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}.types.js";
import type { actionsDeleteEnvironmentSecret } from "../../../../../../../types/paths/repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}.types.js";

export const GET: actionsGetEnvironmentSecret = async ($) => {
  return $.response[200].random();
};

export const PUT: actionsCreateOrUpdateEnvironmentSecret = async ($) => {
  return $.response[201].random();
};

export const DELETE: actionsDeleteEnvironmentSecret = async ($) => {
  return $.response[204].empty();
};

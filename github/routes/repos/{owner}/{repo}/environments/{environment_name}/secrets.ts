import type { actionsListEnvironmentSecrets } from "../../../../../../types/paths/repos/{owner}/{repo}/environments/{environment_name}/secrets.types.js";

export const GET: actionsListEnvironmentSecrets = async ($) => {
  return $.response[200].random();
};

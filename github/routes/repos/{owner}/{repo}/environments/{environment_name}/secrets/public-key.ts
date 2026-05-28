import type { actionsGetEnvironmentPublicKey } from "../../../../../../../types/paths/repos/{owner}/{repo}/environments/{environment_name}/secrets/public-key.types.js";

export const GET: actionsGetEnvironmentPublicKey = async ($) => {
  return $.response[200].random();
};

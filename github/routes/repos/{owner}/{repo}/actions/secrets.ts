import type { actionsListRepoSecrets } from "../../../../../types/paths/repos/{owner}/{repo}/actions/secrets.types.js";

export const GET: actionsListRepoSecrets = async ($) => {
  return $.response[200].random();
};

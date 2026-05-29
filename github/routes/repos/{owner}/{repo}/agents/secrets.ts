import type { agentsListRepoSecrets } from "../../../../../types/paths/repos/{owner}/{repo}/agents/secrets.types.js";

export const GET: agentsListRepoSecrets = async ($) => {
  return $.response[200].random();
};

import type { codespacesListRepoSecrets } from "../../../../../types/paths/repos/{owner}/{repo}/codespaces/secrets.types.js";

export const GET: codespacesListRepoSecrets = async ($) => {
  return $.response[200].random();
};

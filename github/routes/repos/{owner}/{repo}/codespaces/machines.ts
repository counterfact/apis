import type { codespacesRepoMachinesForAuthenticatedUser } from "../../../../../types/paths/repos/{owner}/{repo}/codespaces/machines.types.js";

export const GET: codespacesRepoMachinesForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};

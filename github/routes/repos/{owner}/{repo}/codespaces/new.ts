import type { codespacesPreFlightWithRepoForAuthenticatedUser } from "../../../../../types/paths/repos/{owner}/{repo}/codespaces/new.types.js";

export const GET: codespacesPreFlightWithRepoForAuthenticatedUser = async (
  $,
) => {
  return $.response[200].random();
};

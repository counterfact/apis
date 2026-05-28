import type { codespacesListInRepositoryForAuthenticatedUser } from "../../../../types/paths/repos/{owner}/{repo}/codespaces.types.js";
import type { codespacesCreateWithRepoForAuthenticatedUser } from "../../../../types/paths/repos/{owner}/{repo}/codespaces.types.js";

export const GET: codespacesListInRepositoryForAuthenticatedUser = async (
  $,
) => {
  return $.response[200].random();
};

export const POST: codespacesCreateWithRepoForAuthenticatedUser = async ($) => {
  return $.response[201].random();
};

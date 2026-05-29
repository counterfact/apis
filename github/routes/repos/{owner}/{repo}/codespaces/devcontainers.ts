import type { codespacesListDevcontainersInRepositoryForAuthenticatedUser } from "../../../../../types/paths/repos/{owner}/{repo}/codespaces/devcontainers.types.js";

export const GET: codespacesListDevcontainersInRepositoryForAuthenticatedUser =
  async ($) => {
    return $.response[200].random();
  };

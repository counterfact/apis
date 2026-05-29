import type { codespacesListRepositoriesForSecretForAuthenticatedUser } from "../../../../../types/paths/user/codespaces/secrets/{secret_name}/repositories.types.js";
import type { codespacesSetRepositoriesForSecretForAuthenticatedUser } from "../../../../../types/paths/user/codespaces/secrets/{secret_name}/repositories.types.js";

export const GET: codespacesListRepositoriesForSecretForAuthenticatedUser =
  async ($) => {
    return $.response[200].random();
  };

export const PUT: codespacesSetRepositoriesForSecretForAuthenticatedUser =
  async ($) => {
    return $.response[204].empty();
  };

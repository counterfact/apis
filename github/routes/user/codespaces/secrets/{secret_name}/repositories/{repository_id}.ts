import type { codespacesAddRepositoryForSecretForAuthenticatedUser } from "../../../../../../types/paths/user/codespaces/secrets/{secret_name}/repositories/{repository_id}.types.js";
import type { codespacesRemoveRepositoryForSecretForAuthenticatedUser } from "../../../../../../types/paths/user/codespaces/secrets/{secret_name}/repositories/{repository_id}.types.js";

export const PUT: codespacesAddRepositoryForSecretForAuthenticatedUser = async (
  $,
) => {
  return $.response[204].empty();
};

export const DELETE: codespacesRemoveRepositoryForSecretForAuthenticatedUser =
  async ($) => {
    return $.response[204].empty();
  };

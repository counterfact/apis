import type { codespacesGetSecretForAuthenticatedUser } from "../../../../types/paths/user/codespaces/secrets/{secret_name}.types.js";
import type { codespacesCreateOrUpdateSecretForAuthenticatedUser } from "../../../../types/paths/user/codespaces/secrets/{secret_name}.types.js";
import type { codespacesDeleteSecretForAuthenticatedUser } from "../../../../types/paths/user/codespaces/secrets/{secret_name}.types.js";

export const GET: codespacesGetSecretForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};

export const PUT: codespacesCreateOrUpdateSecretForAuthenticatedUser = async (
  $,
) => {
  return $.response[201].random();
};

export const DELETE: codespacesDeleteSecretForAuthenticatedUser = async ($) => {
  return $.response[204].empty();
};

import type { codespacesListSecretsForAuthenticatedUser } from "../../../types/paths/user/codespaces/secrets.types.js";

export const GET: codespacesListSecretsForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};

import type { codespacesGetPublicKeyForAuthenticatedUser } from "../../../../types/paths/user/codespaces/secrets/public-key.types.js";

export const GET: codespacesGetPublicKeyForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};

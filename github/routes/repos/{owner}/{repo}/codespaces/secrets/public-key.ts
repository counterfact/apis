import type { codespacesGetRepoPublicKey } from "../../../../../../types/paths/repos/{owner}/{repo}/codespaces/secrets/public-key.types.js";

export const GET: codespacesGetRepoPublicKey = async ($) => {
  return $.response[200].random();
};

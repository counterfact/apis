import type { codespacesGetOrgPublicKey } from "../../../../../types/paths/orgs/{org}/codespaces/secrets/public-key.types.js";

export const GET: codespacesGetOrgPublicKey = async ($) => {
  return $.response[200].random();
};

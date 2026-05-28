import type { codespacesListOrgSecrets } from "../../../../types/paths/orgs/{org}/codespaces/secrets.types.js";

export const GET: codespacesListOrgSecrets = async ($) => {
  return $.response[200].random();
};

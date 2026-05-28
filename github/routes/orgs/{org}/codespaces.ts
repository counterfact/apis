import type { codespacesListInOrganization } from "../../../types/paths/orgs/{org}/codespaces.types.js";

export const GET: codespacesListInOrganization = async ($) => {
  return $.response[200].random();
};

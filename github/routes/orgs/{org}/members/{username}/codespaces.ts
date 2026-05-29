import type { codespacesGetCodespacesForUserInOrg } from "../../../../../types/paths/orgs/{org}/members/{username}/codespaces.types.js";

export const GET: codespacesGetCodespacesForUserInOrg = async ($) => {
  return $.response[200].random();
};

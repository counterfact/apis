import type { codespacesDeleteFromOrganization } from "../../../../../../types/paths/orgs/{org}/members/{username}/codespaces/{codespace_name}.types.js";

export const DELETE: codespacesDeleteFromOrganization = async ($) => {
  return $.response[202].empty();
};

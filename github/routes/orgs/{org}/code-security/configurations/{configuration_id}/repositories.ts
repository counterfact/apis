import type { codeSecurityGetRepositoriesForConfiguration } from "../../../../../../types/paths/orgs/{org}/code-security/configurations/{configuration_id}/repositories.types.js";

export const GET: codeSecurityGetRepositoriesForConfiguration = async ($) => {
  return $.response[200].random();
};

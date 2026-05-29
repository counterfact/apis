import type { codeSecurityGetRepositoriesForEnterpriseConfiguration } from "../../../../../../types/paths/enterprises/{enterprise}/code-security/configurations/{configuration_id}/repositories.types.js";

export const GET: codeSecurityGetRepositoriesForEnterpriseConfiguration =
  async ($) => {
    return $.response[200].random();
  };

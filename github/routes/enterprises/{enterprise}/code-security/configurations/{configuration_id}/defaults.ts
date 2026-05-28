import type { codeSecuritySetConfigurationAsDefaultForEnterprise } from "../../../../../../types/paths/enterprises/{enterprise}/code-security/configurations/{configuration_id}/defaults.types.js";

export const PUT: codeSecuritySetConfigurationAsDefaultForEnterprise = async (
  $,
) => {
  return $.response[200].random();
};

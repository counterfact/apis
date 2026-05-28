import type { codeSecurityGetDefaultConfigurationsForEnterprise } from "../../../../../types/paths/enterprises/{enterprise}/code-security/configurations/defaults.types.js";

export const GET: codeSecurityGetDefaultConfigurationsForEnterprise = async (
  $,
) => {
  return $.response[200].random();
};

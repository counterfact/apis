import type { codeSecurityGetDefaultConfigurations } from "../../../../../types/paths/orgs/{org}/code-security/configurations/defaults.types.js";

export const GET: codeSecurityGetDefaultConfigurations = async ($) => {
  return $.response[200].random();
};

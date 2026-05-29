import type { codeSecurityGetConfigurationsForOrg } from "../../../../types/paths/orgs/{org}/code-security/configurations.types.js";
import type { codeSecurityCreateConfiguration } from "../../../../types/paths/orgs/{org}/code-security/configurations.types.js";

export const GET: codeSecurityGetConfigurationsForOrg = async ($) => {
  return $.response[200].random();
};

export const POST: codeSecurityCreateConfiguration = async ($) => {
  return $.response[201].random();
};

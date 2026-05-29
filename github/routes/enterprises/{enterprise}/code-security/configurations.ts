import type { codeSecurityGetConfigurationsForEnterprise } from "../../../../types/paths/enterprises/{enterprise}/code-security/configurations.types.js";
import type { codeSecurityCreateConfigurationForEnterprise } from "../../../../types/paths/enterprises/{enterprise}/code-security/configurations.types.js";

export const GET: codeSecurityGetConfigurationsForEnterprise = async ($) => {
  return $.response[200].random();
};

export const POST: codeSecurityCreateConfigurationForEnterprise = async ($) => {
  return $.response[201].random();
};

import type { codeSecurityGetSingleConfigurationForEnterprise } from "../../../../../types/paths/enterprises/{enterprise}/code-security/configurations/{configuration_id}.types.js";
import type { codeSecurityUpdateEnterpriseConfiguration } from "../../../../../types/paths/enterprises/{enterprise}/code-security/configurations/{configuration_id}.types.js";
import type { codeSecurityDeleteConfigurationForEnterprise } from "../../../../../types/paths/enterprises/{enterprise}/code-security/configurations/{configuration_id}.types.js";

export const GET: codeSecurityGetSingleConfigurationForEnterprise = async (
  $,
) => {
  return $.response[200].random();
};

export const PATCH: codeSecurityUpdateEnterpriseConfiguration = async ($) => {
  return $.response[200].random();
};

export const DELETE: codeSecurityDeleteConfigurationForEnterprise = async (
  $,
) => {
  return $.response[204].empty();
};

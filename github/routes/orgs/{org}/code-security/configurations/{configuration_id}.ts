import type { codeSecurityGetConfiguration } from "../../../../../types/paths/orgs/{org}/code-security/configurations/{configuration_id}.types.js";
import type { codeSecurityUpdateConfiguration } from "../../../../../types/paths/orgs/{org}/code-security/configurations/{configuration_id}.types.js";
import type { codeSecurityDeleteConfiguration } from "../../../../../types/paths/orgs/{org}/code-security/configurations/{configuration_id}.types.js";

export const GET: codeSecurityGetConfiguration = async ($) => {
  return $.response[200].random();
};

export const PATCH: codeSecurityUpdateConfiguration = async ($) => {
  return $.response[200].random();
};

export const DELETE: codeSecurityDeleteConfiguration = async ($) => {
  return $.response[204].empty();
};

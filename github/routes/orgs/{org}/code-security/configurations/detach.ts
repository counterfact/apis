import type { codeSecurityDetachConfiguration } from "../../../../../types/paths/orgs/{org}/code-security/configurations/detach.types.js";

export const DELETE: codeSecurityDetachConfiguration = async ($) => {
  return $.response[204].empty();
};

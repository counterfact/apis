import type { codeSecurityGetConfigurationForRepository } from "../../../../types/paths/repos/{owner}/{repo}/code-security-configuration.types.js";

export const GET: codeSecurityGetConfigurationForRepository = async ($) => {
  return $.response[200].random();
};

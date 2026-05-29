import type { securityAdvisoriesListRepositoryAdvisories } from "../../../../types/paths/repos/{owner}/{repo}/security-advisories.types.js";
import type { securityAdvisoriesCreateRepositoryAdvisory } from "../../../../types/paths/repos/{owner}/{repo}/security-advisories.types.js";

export const GET: securityAdvisoriesListRepositoryAdvisories = async ($) => {
  return $.response[200].random();
};

export const POST: securityAdvisoriesCreateRepositoryAdvisory = async ($) => {
  return $.response[201].random();
};

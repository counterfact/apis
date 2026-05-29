import type { securityAdvisoriesGetRepositoryAdvisory } from "../../../../../types/paths/repos/{owner}/{repo}/security-advisories/{ghsa_id}.types.js";
import type { securityAdvisoriesUpdateRepositoryAdvisory } from "../../../../../types/paths/repos/{owner}/{repo}/security-advisories/{ghsa_id}.types.js";

export const GET: securityAdvisoriesGetRepositoryAdvisory = async ($) => {
  return $.response[200].random();
};

export const PATCH: securityAdvisoriesUpdateRepositoryAdvisory = async ($) => {
  return $.response[200].random();
};

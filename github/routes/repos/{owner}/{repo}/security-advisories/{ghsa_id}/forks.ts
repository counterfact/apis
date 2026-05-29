import type { securityAdvisoriesCreateFork } from "../../../../../../types/paths/repos/{owner}/{repo}/security-advisories/{ghsa_id}/forks.types.js";

export const POST: securityAdvisoriesCreateFork = async ($) => {
  return $.response[202].random();
};

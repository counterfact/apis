import type { securityAdvisoriesCreateRepositoryAdvisoryCveRequest } from "../../../../../../types/paths/repos/{owner}/{repo}/security-advisories/{ghsa_id}/cve.types.js";

export const POST: securityAdvisoriesCreateRepositoryAdvisoryCveRequest =
  async ($) => {
    return $.response[202].empty();
  };

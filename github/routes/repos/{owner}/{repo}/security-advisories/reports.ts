import type { securityAdvisoriesCreatePrivateVulnerabilityReport } from "../../../../../types/paths/repos/{owner}/{repo}/security-advisories/reports.types.js";

export const POST: securityAdvisoriesCreatePrivateVulnerabilityReport = async (
  $,
) => {
  return $.response[201].random();
};

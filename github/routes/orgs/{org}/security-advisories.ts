import type { securityAdvisoriesListOrgRepositoryAdvisories } from "../../../types/paths/orgs/{org}/security-advisories.types.js";

export const GET: securityAdvisoriesListOrgRepositoryAdvisories = async ($) => {
  return $.response[200].random();
};

import type { securityAdvisoriesListGlobalAdvisories } from "../types/paths/advisories.types.js";

export const GET: securityAdvisoriesListGlobalAdvisories = async ($) => {
  return $.response[200].random();
};

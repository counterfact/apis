import type { securityAdvisoriesGetGlobalAdvisory } from "../../types/paths/advisories/{ghsa_id}.types.js";

export const GET: securityAdvisoriesGetGlobalAdvisory = async ($) => {
  return $.response[200].random();
};

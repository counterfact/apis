import type { enterpriseTeamOrganizationsGetAssignments } from "../../../../../types/paths/enterprises/{enterprise}/teams/{enterprise-team}/organizations.types.js";

export const GET: enterpriseTeamOrganizationsGetAssignments = async ($) => {
  return $.response[200].random();
};

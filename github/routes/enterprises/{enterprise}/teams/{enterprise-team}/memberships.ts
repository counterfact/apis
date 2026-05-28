import type { enterpriseTeamMembershipsList } from "../../../../../types/paths/enterprises/{enterprise}/teams/{enterprise-team}/memberships.types.js";

export const GET: enterpriseTeamMembershipsList = async ($) => {
  return $.response[200].random();
};

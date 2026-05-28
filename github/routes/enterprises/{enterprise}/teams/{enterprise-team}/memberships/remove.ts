import type { enterpriseTeamMembershipsBulkRemove } from "../../../../../../types/paths/enterprises/{enterprise}/teams/{enterprise-team}/memberships/remove.types.js";

export const POST: enterpriseTeamMembershipsBulkRemove = async ($) => {
  return $.response[200].random();
};

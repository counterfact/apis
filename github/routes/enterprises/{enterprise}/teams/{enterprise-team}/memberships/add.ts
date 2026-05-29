import type { enterpriseTeamMembershipsBulkAdd } from "../../../../../../types/paths/enterprises/{enterprise}/teams/{enterprise-team}/memberships/add.types.js";

export const POST: enterpriseTeamMembershipsBulkAdd = async ($) => {
  return $.response[200].random();
};

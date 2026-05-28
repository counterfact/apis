import type { enterpriseTeamOrganizationsBulkRemove } from "../../../../../../types/paths/enterprises/{enterprise}/teams/{enterprise-team}/organizations/remove.types.js";

export const POST: enterpriseTeamOrganizationsBulkRemove = async ($) => {
  return $.response[204].empty();
};

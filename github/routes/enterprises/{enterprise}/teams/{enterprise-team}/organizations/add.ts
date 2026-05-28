import type { enterpriseTeamOrganizationsBulkAdd } from "../../../../../../types/paths/enterprises/{enterprise}/teams/{enterprise-team}/organizations/add.types.js";

export const POST: enterpriseTeamOrganizationsBulkAdd = async ($) => {
  return $.response[200].random();
};

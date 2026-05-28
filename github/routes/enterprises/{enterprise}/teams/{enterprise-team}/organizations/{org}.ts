import type { enterpriseTeamOrganizationsGetAssignment } from "../../../../../../types/paths/enterprises/{enterprise}/teams/{enterprise-team}/organizations/{org}.types.js";
import type { enterpriseTeamOrganizationsAdd } from "../../../../../../types/paths/enterprises/{enterprise}/teams/{enterprise-team}/organizations/{org}.types.js";
import type { enterpriseTeamOrganizationsDelete } from "../../../../../../types/paths/enterprises/{enterprise}/teams/{enterprise-team}/organizations/{org}.types.js";

export const GET: enterpriseTeamOrganizationsGetAssignment = async ($) => {
  return $.response[200].random();
};

export const PUT: enterpriseTeamOrganizationsAdd = async ($) => {
  return $.response[201].random();
};

export const DELETE: enterpriseTeamOrganizationsDelete = async ($) => {
  return $.response[204].empty();
};

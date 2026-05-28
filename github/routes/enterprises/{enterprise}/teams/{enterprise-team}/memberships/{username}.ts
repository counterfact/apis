import type { enterpriseTeamMembershipsGet } from "../../../../../../types/paths/enterprises/{enterprise}/teams/{enterprise-team}/memberships/{username}.types.js";
import type { enterpriseTeamMembershipsAdd } from "../../../../../../types/paths/enterprises/{enterprise}/teams/{enterprise-team}/memberships/{username}.types.js";
import type { enterpriseTeamMembershipsRemove } from "../../../../../../types/paths/enterprises/{enterprise}/teams/{enterprise-team}/memberships/{username}.types.js";

export const GET: enterpriseTeamMembershipsGet = async ($) => {
  return $.response[200].random();
};

export const PUT: enterpriseTeamMembershipsAdd = async ($) => {
  return $.response[201].random();
};

export const DELETE: enterpriseTeamMembershipsRemove = async ($) => {
  return $.response[204].empty();
};
